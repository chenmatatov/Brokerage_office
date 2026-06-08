import { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

function ChatBot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'שלום! אני הבוט של אתר הנדל"ן 🏠\nאוכל לעזור לך לחפש דירות, לחשב משכנתא או לשלוח פנייה לסוכן.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const send = async () => {
        if (!input.trim() || loading) return;
        const userMsg = { role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const history = newMessages.filter(m => m.role !== 'assistant' || newMessages.indexOf(m) > 0);
            const res = await fetch('http://localhost:5001/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'שגיאה בתשובה' }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: '❌ לא ניתן להתחבר לשרת הבוט. וודא שהוא פועל.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-wrapper">
            {open && (
                <div className="chatbot-box">
                    <div className="chatbot-header">
                        <span>🏠 בוט נדל"ן</span>
                        <button onClick={() => setOpen(false)}>✕</button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((m, i) => (
                            <div key={i} className={`chatbot-msg ${m.role}`}>
                                {m.content}
                            </div>
                        ))}
                        {loading && <div className="chatbot-msg assistant typing">...</div>}
                        <div ref={bottomRef} />
                    </div>
                    <div className="chatbot-input">
                        <input
                            placeholder="כתוב הודעה..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && send()}
                        />
                        <button onClick={send} disabled={loading}>שלח</button>
                    </div>
                </div>
            )}
            <button className="chatbot-fab" onClick={() => setOpen(!open)}>
                {open ? '✕' : '💬'}
            </button>
        </div>
    );
}

export default ChatBot;
