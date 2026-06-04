package com.apartment.demo.service;

import com.apartment.demo.entities.Property;
import com.apartment.demo.entities.PropertyImage;
import com.apartment.demo.repository.PropertyImageRepository;
import com.apartment.demo.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PropertyImageServiceImpl implements PropertyImageService {

    private final PropertyImageRepository propertyImageRepository;
    private final PropertyRepository propertyRepository;

    @Override
    public void addImage(Long propertyId, String imageUrl) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyException(" - Property not found: " + propertyId));
        PropertyImage image = new PropertyImage();
        image.setImageUrl(imageUrl);
        image.setProperty(property);
        propertyImageRepository.save(image);
    }
}
