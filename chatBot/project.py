from openai import OpenAI
import requests
import json
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

# ===== RAG Knowledge Base =====
REAL_ESTATE_KB = """
## Home Buying Process in Israel

### Purchase Steps:
1. Set a budget and get pre-approval for a mortgage from the bank
2. Search for a suitable property through a real estate agent or listing sites
3. Check the Tabu (land registry) to verify ownership and liens
4. Physical inspection of the property (appraiser/engineer)
5. Sign a memorandum of understanding and pay a deposit (10%)
6. Sign a purchase contract with a lawyer
7. Finalize the mortgage
8. Transfer ownership in the Tabu

### Real Estate Taxes:
- Purchase tax (Mas Rechisha): First apartment - exempt up to ~1.9M NIS, then 3.5%-10%
- Second apartment and above: purchase tax from 8%
- Capital gains tax (Mas Shevach): charged to the seller on profit from sale
- Betterment levy (Hetel Hashbacha): if building rights were added

### Mortgages in Israel:
- Maximum financing: 75% for first apartment, 50% for second
- Tracks: fixed interest, variable, or CPI-linked
- Maximum period: 30 years
- Recommended to split into at least 3 tracks to spread risk

### Mandatory Checks Before Buying:
- Tabu extract / rights certificate from the Israel Land Authority
- City building plan (Taba) - check the property's designation
- Building permits and occupancy certificate
- Outstanding property tax (Arnona) and management fees

### Additional Purchase Costs:
- Lawyer fees: 0.5%-1.5% of apartment price
- Agent commission: 2% + VAT
- Appraisal: 1,500-3,000 NIS
- Tabu registration: a few hundred shekels
"""

# ===== Tools Definitions =====
tools = [
    {
        "type": "function",
        "function": {
            "name": "search_properties",
            "description": "Search for properties by city, number of rooms, or free-text keyword",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "City name to search in, e.g. Tel Aviv"},
                    "rooms": {"type": "number", "description": "Number of rooms"},
                    "keyword": {"type": "string", "description": "Free-text search keyword"}
                },
                "additionalProperties": False,
                "required": ["city", "rooms", "keyword"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "calculate_mortgage",
            "description": "Calculate monthly mortgage payment",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "property_price": {"type": "number", "description": "Property price in NIS"},
                    "funding_percent": {"type": "number", "description": "Funding percentage (10-75)"},
                    "annual_interest": {"type": "number", "description": "Annual interest rate in percent"},
                    "years": {"type": "number", "description": "Mortgage period in years"}
                },
                "additionalProperties": False,
                "required": ["property_price", "funding_percent", "annual_interest", "years"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "send_contact",
            "description": "Send an inquiry to an agent for a specific property",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "property_id": {"type": "number", "description": "Property ID"},
                    "agent_id": {"type": "number", "description": "Agent ID"},
                    "sender_name": {"type": "string", "description": "Sender name"},
                    "sender_email": {"type": "string", "description": "Sender email"},
                    "sender_phone": {"type": "string", "description": "Sender phone"},
                    "message": {"type": "string", "description": "Message content"}
                },
                "additionalProperties": False,
                "required": ["property_id", "agent_id", "sender_name", "sender_email", "sender_phone", "message"]
            }
        }
    }
]

# ===== Tool Implementations =====
def search_properties(city="", rooms=0, keyword=""):
    BASE = "http://localhost:8080"
    try:
        if city:
            r = requests.get(f"{BASE}/properties/city/{city}", timeout=3)
        elif rooms:
            r = requests.get(f"{BASE}/properties/rooms/{rooms}", timeout=3)
        elif keyword:
            r = requests.get(f"{BASE}/properties/search", params={"keyword": keyword}, timeout=3)
        else:
            r = requests.get(f"{BASE}/properties/getAll", timeout=3)
        r.raise_for_status()
        props = r.json()
        if not props:
            return {"status": "not_found", "message": "No matching properties found", "properties": []}
        results = [
            {
                "id": p.get("id"),
                "address": p.get("address"),
                "price": p.get("price"),
                "rooms": p.get("rooms"),
                "agentName": p.get("agentName"),
                "agentId": p.get("agentId")
            }
            for p in props[:5]
        ]
        return {"status": "found", "count": len(props), "properties": results}
    except requests.exceptions.ConnectionError:
        demo = [
            {"id": 1, "address": "Herzl St 5, Tel Aviv", "price": 2500000, "rooms": 3, "agentName": "Israel Israeli", "agentId": 2},
            {"id": 2, "address": "Weizmann St 12, Tel Aviv", "price": 3200000, "rooms": 4, "agentName": "Israel Israeli", "agentId": 2},
            {"id": 3, "address": "Rothschild Blvd 8, Tel Aviv", "price": 4100000, "rooms": 5, "agentName": "Dana Cohen", "agentId": 3},
            {"id": 4, "address": "Herzl St 20, Jerusalem", "price": 1800000, "rooms": 3, "agentName": "Dana Cohen", "agentId": 3},
            {"id": 5, "address": "Ben Gurion St 3, Haifa", "price": 1200000, "rooms": 2, "agentName": "Israel Israeli", "agentId": 2},
        ]
        filtered = [p for p in demo if
                    (not city or city.lower() in p["address"].lower()) and
                    (not rooms or p["rooms"] == rooms) and
                    (not keyword or keyword.lower() in p["address"].lower())]
        return {"status": "demo", "note": "Backend offline - showing demo data", "count": len(filtered), "properties": filtered}


def calculate_mortgage(property_price, funding_percent, annual_interest, years):
    if not (10 <= funding_percent <= 75):
        return {"status": "error", "message": "Funding percent must be between 10% and 75%"}
    loan = property_price * (funding_percent / 100)
    monthly_rate = annual_interest / 100 / 12
    n = int(years * 12)
    if monthly_rate == 0:
        monthly_payment = loan / n
    else:
        monthly_payment = loan * (monthly_rate * (1 + monthly_rate)**n) / ((1 + monthly_rate)**n - 1)
    total_payment = monthly_payment * n
    return {
        "status": "success",
        "loan_amount": round(loan),
        "monthly_payment": round(monthly_payment),
        "total_payment": round(total_payment),
        "total_interest": round(total_payment - loan)
    }


def send_contact(property_id, agent_id, sender_name, sender_email, sender_phone, message):
    payload = {
        "propertyId": property_id,
        "agentId": agent_id,
        "senderName": sender_name,
        "senderEmail": sender_email,
        "senderPhone": sender_phone,
        "message": message
    }
    try:
        r = requests.post("http://localhost:8080/contact/send", json=payload, timeout=3)
        r.raise_for_status()
        return {"status": "success", "message": "Inquiry sent successfully to the agent!"}
    except requests.exceptions.ConnectionError:
        return {"status": "demo", "message": f"(Demo) Inquiry from {sender_name} sent to agent for property #{property_id}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


TOOL_MAP = {
    "search_properties": search_properties,
    "calculate_mortgage": calculate_mortgage,
    "send_contact": send_contact
}

# ===== System Prompt with RAG =====
SYSTEM_PROMPT = f"""You are a professional digital assistant for an Israeli real estate website.
Your role: help users search for properties, calculate mortgages, send inquiries to agents, and provide information about the home buying process in Israel.

Important rules:
- Answer ONLY questions related to real estate, apartments, mortgages, and buying/selling properties.
- If asked about any other topic, politely refuse: "I'm sorry, I specialize only in real estate topics and cannot help with that."
- Be friendly, professional, and focused.
- When displaying prices, use NIS (Israeli Shekel).

Your knowledge base:
{REAL_ESTATE_KB}

When a user asks to search for a property, calculate a mortgage, or send an inquiry - use the appropriate tools.
Before sending an inquiry, make sure you have: name, email, phone, property ID, and agent ID.
"""

# ===== Chat Loop =====
def run_tool_call(tool_name, args):
    func = TOOL_MAP.get(tool_name)
    if not func:
        return {"error": "Unknown tool"}
    return func(**args)


def chat():
    history = [{"role": "system", "content": SYSTEM_PROMPT}]
    print("=" * 55)
    print("   Welcome to the Real Estate Chatbot")
    print("   Type '.' to exit")
    print("=" * 55)

    while True:
        user_input = input("\nYou: ").strip()
        if user_input == ".":
            print("Goodbye!")
            break
        if not user_input:
            continue

        history.append({"role": "user", "content": user_input})

        try:
            response = client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=history,
                tools=tools,
                tool_choice="auto"
            )
            msg = response.choices[0].message

            while msg.tool_calls:
                history.append({"role": "assistant", "content": msg.content, "tool_calls": [
                    {"id": tc.id, "type": "function", "function": {"name": tc.function.name, "arguments": tc.function.arguments}}
                    for tc in msg.tool_calls
                ]})
                for tc in msg.tool_calls:
                    args = json.loads(tc.function.arguments)
                    result = run_tool_call(tc.function.name, args)
                    history.append({
                        "role": "tool",
                        "tool_call_id": tc.id,
                        "content": json.dumps(result, ensure_ascii=False)
                    })
                response = client.chat.completions.create(
                    model="gpt-4.1-mini",
                    messages=history,
                    tools=tools,
                    tool_choice="auto"
                )
                msg = response.choices[0].message

            ai_reply = msg.content or ""
            print(f"\nBot: {ai_reply}")
            history.append({"role": "assistant", "content": ai_reply})

        except Exception as e:
            print(f"Error: {e}")


if __name__ == "__main__":
    chat()
