package com.yourapp.billing.service;

import com.yourapp.billing.dto.response.MenuItemResponse;
import com.yourapp.billing.entity.MenuItem;
import com.yourapp.billing.exception.ResourceNotFoundException;
import com.yourapp.billing.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;

    @Transactional(readOnly = true)
    public List<MenuItemResponse> getAllAvailableMenuItems() {
        return menuItemRepository.findByIsAvailableTrueOrderByCategoryAscIdAsc()
                .stream()
                .map(MenuItemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MenuItemResponse> getMenuItemsByCategory(String category) {
        return menuItemRepository.findByCategoryOrderByCategoryAscIdAsc(category)
                .stream()
                .map(MenuItemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MenuItemResponse getMenuItemById(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn với mã ID: " + id));
        return MenuItemResponse.fromEntity(menuItem);
    }
}
