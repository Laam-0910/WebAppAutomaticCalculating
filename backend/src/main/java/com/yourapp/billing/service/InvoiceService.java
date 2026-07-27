package com.yourapp.billing.service;

import com.yourapp.billing.dto.request.CreateInvoiceRequest;
import com.yourapp.billing.dto.response.InvoiceResponse;
import com.yourapp.billing.entity.Invoice;
import com.yourapp.billing.entity.Order;
import com.yourapp.billing.exception.BadRequestException;
import com.yourapp.billing.exception.ResourceNotFoundException;
import com.yourapp.billing.repository.InvoiceRepository;
import com.yourapp.billing.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public InvoiceResponse createInvoice(CreateInvoiceRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng ID: " + request.getOrderId()));

        if (invoiceRepository.findByOrderId(order.getId()).isPresent()) {
            throw new BadRequestException("Đơn hàng này đã được xuất hóa đơn.");
        }

        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = invoiceRepository.count() + 1;
        String invoiceCode = String.format("INV%s%04d", datePrefix, count);

        Invoice invoice = Invoice.builder()
                .invoiceCode(invoiceCode)
                .order(order)
                .paymentMethod(request.getPaymentMethod().toUpperCase())
                .paymentStatus("PAID")
                .amount(order.getTotalAmount())
                .paidAt(LocalDateTime.now())
                .build();

        // Cập nhật đơn hàng thành COMPLETED
        order.setStatus("COMPLETED");
        orderRepository.save(order);

        Invoice savedInvoice = invoiceRepository.save(invoice);
        return InvoiceResponse.fromEntity(savedInvoice);
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getAllInvoices() {
        return invoiceRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(InvoiceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hóa đơn ID: " + id));
        return InvoiceResponse.fromEntity(invoice);
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceByOrderId(Long orderId) {
        Invoice invoice = invoiceRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hóa đơn cho đơn hàng ID: " + orderId));
        return InvoiceResponse.fromEntity(invoice);
    }
}
