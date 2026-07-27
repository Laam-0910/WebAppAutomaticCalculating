package com.yourapp.billing.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {

    private String customerName;
    private String customerPhone;
    private BigDecimal discount;

    @NotEmpty(message = "Danh sách món ăn không được để trống")
    @Valid
    private List<CreateOrderItemRequest> items;
}
