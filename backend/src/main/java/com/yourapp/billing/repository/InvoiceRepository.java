package com.yourapp.billing.repository;

import com.yourapp.billing.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByInvoiceCode(String invoiceCode);
    Optional<Invoice> findByOrderId(Long orderId);
    List<Invoice> findAllByOrderByCreatedAtDesc();
}
