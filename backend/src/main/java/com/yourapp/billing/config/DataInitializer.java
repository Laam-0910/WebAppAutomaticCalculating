package com.yourapp.billing.config;

import com.yourapp.billing.entity.MenuItem;
import com.yourapp.billing.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final MenuItemRepository menuItemRepository;

    @Override
    public void run(String... args) {
        log.info("Bat dau khoi tao & don dep trung lap trong CSDL thuc don...");

        List<MenuItem> defaultItems = Arrays.asList(
            // ──────────────────── MÌ ────────────────────
            MenuItem.builder().name("Mì trộn trứng ốp la").category("MI").price(new BigDecimal("30000")).unit("PHẦN")
                    .imageUrl("/icons/items/mi_tron_trung.png").isAvailable(true).build(),
            MenuItem.builder().name("Mì trộn topping ngẫu nhiên").category("MI").price(new BigDecimal("35000")).unit("PHẦN")
                    .imageUrl("/icons/items/mi_tron_topping.png").isAvailable(true).build(),
            MenuItem.builder().name("Mì trộn Indo trứng ốp la").category("MI").price(new BigDecimal("30000")).unit("PHẦN")
                    .imageUrl("/icons/items/mi_tron_indo.png").isAvailable(true).build(),

            // ──────────────────── XÚC XÍCH ────────────────────
            MenuItem.builder().name("Xúc xích").category("XUC_XICH").price(new BigDecimal("10000")).unit("CÂY")
                    .imageUrl("/icons/items/xuc_xich_thuong.png").isAvailable(true).build(),
            MenuItem.builder().name("Xúc xích xông khói").category("XUC_XICH").price(new BigDecimal("12000")).unit("CÂY")
                    .imageUrl("/icons/items/xuc_xich_xong_khoi.png").isAvailable(true).build(),
            MenuItem.builder().name("Xúc xích nhân sốt phô mai").category("XUC_XICH").price(new BigDecimal("15000")).unit("CÂY")
                    .imageUrl("/icons/items/xuc_xich_pho_mai.png").isAvailable(true).build(),

            // ──────────────────── GÀ ────────────────────
            MenuItem.builder().name("Đùi gà rán").category("GA").price(new BigDecimal("35000")).unit("PHẦN")
                    .imageUrl("/icons/items/dui_ga_ran.png").isAvailable(true).build(),
            MenuItem.builder().name("Gà viên popcorn CP").category("GA").price(new BigDecimal("10000")).unit("XIÊN")
                    .imageUrl("/icons/items/ga_popcorn.png").isAvailable(true).build(),

            // ──────────────────── XIÊN QUE ────────────────────
            MenuItem.builder().name("Phô mai viên").category("XIEN").price(new BigDecimal("12000")).unit("XIÊN")
                    .imageUrl("/icons/items/pho_mai_vien.png").isAvailable(true).build(),
            MenuItem.builder().name("Phô mai que").category("XIEN").price(new BigDecimal("10000")).unit("XIÊN")
                    .imageUrl("/icons/items/pho_mai_que.png").isAvailable(true).build(),
            MenuItem.builder().name("Cá viên chiên").category("XIEN").price(new BigDecimal("5000")).unit("XIÊN")
                    .imageUrl("/icons/items/ca_vien_chien.png").isAvailable(true).build(),
            MenuItem.builder().name("Bò viên chiên").category("XIEN").price(new BigDecimal("5000")).unit("XIÊN")
                    .imageUrl("/icons/items/bo_vien_chien.png").isAvailable(true).build(),
            MenuItem.builder().name("Tôm viên chiên").category("XIEN").price(new BigDecimal("5000")).unit("XIÊN")
                    .imageUrl("/icons/items/tom_vien_chien.png").isAvailable(true).build(),
            MenuItem.builder().name("Mực viên chiên").category("XIEN").price(new BigDecimal("5000")).unit("XIÊN")
                    .imageUrl("/icons/items/muc_vien_chien.png").isAvailable(true).build(),
            MenuItem.builder().name("Cốm hồng").category("XIEN").price(new BigDecimal("10000")).unit("XIÊN")
                    .imageUrl("/icons/items/com_hong.png").isAvailable(true).build(),
            MenuItem.builder().name("Cốm xanh").category("XIEN").price(new BigDecimal("10000")).unit("XIÊN")
                    .imageUrl("/icons/items/com_xanh.png").isAvailable(true).build(),
            MenuItem.builder().name("Chả bắp hồng hà").category("XIEN").price(new BigDecimal("10000")).unit("XIÊN")
                    .imageUrl("/icons/items/cha_bap.png").isAvailable(true).build(),

            // ──────────────────── KHÁC ────────────────────
            MenuItem.builder().name("Hotdog xúc xích mini").category("KHAC").price(new BigDecimal("10000")).unit("CÂY")
                    .imageUrl("/icons/items/hotdog_mini.png").isAvailable(true).build(),

            // ──────────────────── NƯỚC GIẢI KHÁT ────────────────────
            MenuItem.builder().name("Pepsi").category("NUOC_GIAI_KHAT").price(new BigDecimal("12000")).unit("LON")
                    .imageUrl("/icons/items/pepsi.png").isAvailable(true).build(),
            MenuItem.builder().name("Coca Cola").category("NUOC_GIAI_KHAT").price(new BigDecimal("12000")).unit("LON")
                    .imageUrl("/icons/items/coca.png").isAvailable(true).build(),
            MenuItem.builder().name("7Up").category("NUOC_GIAI_KHAT").price(new BigDecimal("12000")).unit("LON")
                    .imageUrl("/icons/items/7up.png").isAvailable(true).build(),
            MenuItem.builder().name("Trà Ô Long TEA+").category("NUOC_GIAI_KHAT").price(new BigDecimal("12000")).unit("CHAI")
                    .imageUrl("/icons/items/tra_olong.png").isAvailable(true).build(),
            MenuItem.builder().name("Revive").category("NUOC_GIAI_KHAT").price(new BigDecimal("12000")).unit("CHAI")
                    .imageUrl("/icons/items/revive.png").isAvailable(true).build(),
            MenuItem.builder().name("Sting").category("NUOC_GIAI_KHAT").price(new BigDecimal("12000")).unit("CHAI")
                    .imageUrl("/icons/items/sting.png").isAvailable(true).build(),
            MenuItem.builder().name("Bò Húc (Nước tăng lực)").category("NUOC_GIAI_KHAT").price(new BigDecimal("13000")).unit("LON")
                    .imageUrl("/icons/items/bo_huc.png").isAvailable(true).build(),
            MenuItem.builder().name("Nước Suối Aquafina").category("NUOC_GIAI_KHAT").price(new BigDecimal("7000")).unit("CHAI")
                    .imageUrl("/icons/items/nuoc_suoi.png").isAvailable(true).build()
        );

        // Quy trình Upsert thông minh + Tự động gộp dọn dẹp các bản sao trùng lặp
        for (MenuItem item : defaultItems) {
            List<MenuItem> existingList = menuItemRepository.findByName(item.getName());
            if (!existingList.isEmpty()) {
                // Giữ lại bản ghi đầu tiên làm gốc và đồng bộ thông tin mới nhất
                MenuItem dbItem = existingList.get(0);
                dbItem.setCategory(item.getCategory());
                dbItem.setPrice(item.getPrice());
                dbItem.setUnit(item.getUnit());
                dbItem.setImageUrl(item.getImageUrl());
                dbItem.setIsAvailable(item.getIsAvailable());
                menuItemRepository.save(dbItem);

                // Xóa bỏ tất cả các bản ghi trùng tên dư thừa (tránh duplicate)
                if (existingList.size() > 1) {
                    for (int i = 1; i < existingList.size(); i++) {
                        try {
                            menuItemRepository.delete(existingList.get(i));
                        } catch (Exception e) {
                            log.warn("Khong the xoa ban sao trung vi dang duoc don hang lien ket: {}", e.getMessage());
                        }
                    }
                }
            } else {
                menuItemRepository.save(item);
            }
        }

        // Dọn dẹp bất kỳ món nào không thuộc danh sách 26 món default
        try {
            List<MenuItem> allInDb = menuItemRepository.findAll();
            for (MenuItem dbItem : allInDb) {
                boolean isDefault = defaultItems.stream().anyMatch(d -> d.getName().equals(dbItem.getName()));
                if (!isDefault) {
                    menuItemRepository.delete(dbItem);
                }
            }
        } catch (Exception e) {
            log.warn("Loi khi quet don dep mon an ngoai danh sach: {}", e.getMessage());
        }

        log.info("Hoan thanh quet don sach duplicate! CSDL hien tai chi con dung 26 mon chuan.");
    }
}
