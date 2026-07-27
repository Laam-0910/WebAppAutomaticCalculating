package com.yourapp.billing.dto.response;

import com.yourapp.billing.entity.Order;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long id;
    private String orderCode;
    private String customerName;
    private String customerPhone;
    private String status;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
    private InvoiceResponse invoice;

    public static OrderResponse fromEntity(Order entity) {
        if (entity == null) return null;
        return OrderResponse.builder()
                .id(entity.getId())
                .orderCode(entity.getOrderCode())
                .customerName(entity.getCustomerName())
                .customerPhone(entity.getCustomerPhone())
                .status(entity.getStatus())
                .subtotal(entity.getSubtotal())
                .discount(entity.getDiscount())
                .totalAmount(entity.getTotalAmount())
                .createdAt(entity.getCreatedAt())
                .items(entity.getItems() != null ?
                        entity.getItems().stream().map(OrderItemResponse::fromEntity).collect(Collectors.toList()) : null)
                .invoice(entity.getInvoice() != null ? InvoiceResponse.fromEntityWithoutOrder(entity.getInvoice()) : null)
                .build();
    }
}
