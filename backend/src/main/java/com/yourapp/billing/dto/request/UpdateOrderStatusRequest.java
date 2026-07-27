package com.yourapp.billing.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateOrderStatusRequest {

    @NotBlank(message = "Trạng thái đơn hàng không được để trống")
    private String status; // PENDING, CONFIRMED, COMPLETED, CANCELLED
}
