package com.yourapp.billing.service;

import com.yourapp.billing.dto.request.CreateOrderItemRequest;
import com.yourapp.billing.dto.request.CreateOrderRequest;
import com.yourapp.billing.dto.request.UpdateOrderStatusRequest;
import com.yourapp.billing.dto.response.OrderResponse;
import com.yourapp.billing.entity.MenuItem;
import com.yourapp.billing.entity.Order;
import com.yourapp.billing.entity.OrderItem;
import com.yourapp.billing.exception.BadRequestException;
import com.yourapp.billing.exception.ResourceNotFoundException;
import com.yourapp.billing.repository.MenuItemRepository;
import com.yourapp.billing.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Đơn hàng phải chứa ít nhất 1 món ăn.");
        }

        // Tạo mã đơn tự động ORDYYYYMMDDxxx
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = orderRepository.count() + 1;
        String orderCode = String.format("ORD%s%04d", datePrefix, count);

        Order order = Order.builder()
                .orderCode(orderCode)
                .customerName(request.getCustomerName() != null && !request.getCustomerName().isBlank() ? request.getCustomerName() : "Khách hàng")
                .customerPhone(request.getCustomerPhone())
                .status("PENDING")
                .discount(request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO)
                .build();

        BigDecimal subtotal = BigDecimal.ZERO;

        for (CreateOrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn với ID: " + itemReq.getMenuItemId()));

            if (Boolean.FALSE.equals(menuItem.getIsAvailable())) {
                throw new BadRequestException("Món ăn '" + menuItem.getName() + "' hiện tạm ngưng phục vụ.");
            }

            BigDecimal itemSubtotal = menuItem.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(itemSubtotal);

            OrderItem orderItem = OrderItem.builder()
                    .menuItem(menuItem)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(menuItem.getPrice())
                    .subtotal(itemSubtotal)
                    .note(itemReq.getNote())
                    .build();

            order.addItem(orderItem);
        }

        order.setSubtotal(subtotal);
        BigDecimal discountAmount = order.getDiscount();
        BigDecimal totalAmount = subtotal.subtract(discountAmount);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        return OrderResponse.fromEntity(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByStatus(String status) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng ID: " + id));
        return OrderResponse.fromEntity(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng ID: " + id));
        order.setStatus(request.getStatus().toUpperCase());
        Order updated = orderRepository.save(order);
        return OrderResponse.fromEntity(updated);
    }
}
