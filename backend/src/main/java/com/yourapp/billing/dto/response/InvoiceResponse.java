package com.yourapp.billing.dto.response;

import com.yourapp.billing.entity.Invoice;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceResponse {

    private Long id;
    private String invoiceCode;
    private Long orderId;
    private String orderCode;
    private String customerName;
    private String paymentMethod;
    private String paymentStatus;
    private BigDecimal amount;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
    private OrderResponse order;

    public static InvoiceResponse fromEntity(Invoice entity) {
        if (entity == null) return null;
        return InvoiceResponse.builder()
                .id(entity.getId())
                .invoiceCode(entity.getInvoiceCode())
                .orderId(entity.getOrder() != null ? entity.getOrder().getId() : null)
                .orderCode(entity.getOrder() != null ? entity.getOrder().getOrderCode() : null)
                .customerName(entity.getOrder() != null ? entity.getOrder().getCustomerName() : null)
                .paymentMethod(entity.getPaymentMethod())
                .paymentStatus(entity.getPaymentStatus())
                .amount(entity.getAmount())
                .paidAt(entity.getPaidAt())
                .createdAt(entity.getCreatedAt())
                .order(OrderResponse.fromEntity(entity.getOrder()))
                .build();
    }

    public static InvoiceResponse fromEntityWithoutOrder(Invoice entity) {
        if (entity == null) return null;
        return InvoiceResponse.builder()
                .id(entity.getId())
                .invoiceCode(entity.getInvoiceCode())
                .orderId(entity.getOrder() != null ? entity.getOrder().getId() : null)
                .orderCode(entity.getOrder() != null ? entity.getOrder().getOrderCode() : null)
                .customerName(entity.getOrder() != null ? entity.getOrder().getCustomerName() : null)
                .paymentMethod(entity.getPaymentMethod())
                .paymentStatus(entity.getPaymentStatus())
                .amount(entity.getAmount())
                .paidAt(entity.getPaidAt())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
