package com.yourapp.billing.controller;

import com.yourapp.billing.dto.response.ApiResponse;
import com.yourapp.billing.dto.response.MenuItemResponse;
import com.yourapp.billing.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getAllMenuItems(
            @RequestParam(required = false) String category) {
        List<MenuItemResponse> items;
        if (category != null && !category.isBlank()) {
            items = menuService.getMenuItemsByCategory(category);
        } else {
            items = menuService.getAllAvailableMenuItems();
        }
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thực đơn thành công", items));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemResponse>> getMenuItemById(@PathVariable Long id) {
        MenuItemResponse item = menuService.getMenuItemById(id);
        return ResponseEntity.ok(ApiResponse.success(item));
    }
}
