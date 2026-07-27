package com.yourapp.billing.repository;

import com.yourapp.billing.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByIsAvailableTrueOrderByCategoryAscIdAsc();
    List<MenuItem> findByCategoryOrderByCategoryAscIdAsc(String category);
    List<MenuItem> findByName(String name);
}
