package com.yourapp.billing.dto.response;

import com.yourapp.billing.entity.OrderItem;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {

    private Long id;
    private Long menuItemId;
    private String menuItemName;
    private String category;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
    private String note;

    public static OrderItemResponse fromEntity(OrderItem entity) {
        if (entity == null) return null;
        return OrderItemResponse.builder()
                .id(entity.getId())
                .menuItemId(entity.getMenuItem() != null ? entity.getMenuItem().getId() : null)
                .menuItemName(entity.getMenuItem() != null ? entity.getMenuItem().getName() : null)
                .category(entity.getMenuItem() != null ? entity.getMenuItem().getCategory() : null)
                .quantity(entity.getQuantity())
                .unitPrice(entity.getUnitPrice())
                .subtotal(entity.getSubtotal())
                .note(entity.getNote())
                .build();
    }
}
