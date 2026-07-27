package com.yourapp.billing.dto.response;

import com.yourapp.billing.entity.MenuItem;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemResponse {

    private Long id;
    private String name;
    private String category;
    private BigDecimal price;
    private String unit;
    private String imageUrl;
    private Boolean isAvailable;

    public static MenuItemResponse fromEntity(MenuItem entity) {
        if (entity == null) return null;
        return MenuItemResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .category(entity.getCategory())
                .price(entity.getPrice())
                .unit(entity.getUnit())
                .imageUrl(entity.getImageUrl())
                .isAvailable(entity.getIsAvailable())
                .build();
    }
}
