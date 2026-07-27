/*
==========================================================
Horse Billing App - SQL Server Database Script
Database: HorseBillingDB
==========================================================
*/

-- 1. CREATE DATABASE
IF DB_ID(N'HorseBillingDB') IS NULL
BEGIN
    CREATE DATABASE HorseBillingDB;
END
GO

USE HorseBillingDB;
GO

-- 2. DROP TABLES IF THEY ALREADY EXIST
IF OBJECT_ID(N'dbo.Invoice', N'U') IS NOT NULL
    DROP TABLE dbo.Invoice;
GO

IF OBJECT_ID(N'dbo.OrderItem', N'U') IS NOT NULL
    DROP TABLE dbo.OrderItem;
GO

IF OBJECT_ID(N'dbo.Orders', N'U') IS NOT NULL
    DROP TABLE dbo.Orders;
GO

IF OBJECT_ID(N'dbo.MenuItem', N'U') IS NOT NULL
    DROP TABLE dbo.MenuItem;
GO

-- 3. CREATE MENU ITEM TABLE
CREATE TABLE dbo.MenuItem (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    category NVARCHAR(50) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    image_url NVARCHAR(500) NULL,
    is_available BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NULL,

    CONSTRAINT CK_MenuItem_Price
        CHECK (price >= 0)
);
GO

-- 4. INSERT MENU DATA WITH HIGH QUALITY FOOD IMAGES
-- MÌ
INSERT INTO dbo.MenuItem (name, category, price, image_url)
VALUES
(N'Mì trộn trứng ốp la', N'MI', 30000, N'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80'),
(N'Mì trộn topping ngẫu nhiên', N'MI', 35000, N'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80'),
(N'Mì trộn Indo trứng ốp la', N'MI', 30000, N'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&auto=format&fit=crop&q=80');

-- XÚC XÍCH
INSERT INTO dbo.MenuItem (name, category, price, image_url)
VALUES
(N'Xúc xích', N'XUC_XICH', 10000, N'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&auto=format&fit=crop&q=80'),
(N'Xúc xích xông khói', N'XUC_XICH', 12000, N'https://images.unsplash.com/photo-1597393353415-b3730f3719fe?w=600&auto=format&fit=crop&q=80'),
(N'Xúc xích nhân sốt phô mai', N'XUC_XICH', 15000, N'https://images.unsplash.com/photo-1585325701165-351af916e581?w=600&auto=format&fit=crop&q=80');

-- GÀ
INSERT INTO dbo.MenuItem (name, category, price, image_url)
VALUES
(N'Đùi gà rán', N'GA', 35000, N'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&auto=format&fit=crop&q=80'),
(N'Gà viên popcorn CP', N'GA', 10000, N'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80');

-- XIÊN
INSERT INTO dbo.MenuItem (name, category, price, image_url)
VALUES
(N'Phô mai viên', N'XIEN', 12000, N'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80'),
(N'Phô mai que', N'XIEN', 10000, N'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=600&auto=format&fit=crop&q=80'),
(N'Cá viên chiên', N'XIEN', 5000, N'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80'),
(N'Bò viên chiên', N'XIEN', 5000, N'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&auto=format&fit=crop&q=80'),
(N'Tôm viên chiên', N'XIEN', 5000, N'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80'),
(N'Mực viên chiên', N'XIEN', 5000, N'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80'),
(N'Cốm hồng', N'XIEN', 10000, N'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80'),
(N'Cốm xanh', N'XIEN', 10000, N'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'),
(N'Chả bắp hồng hà', N'XIEN', 10000, N'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80');

-- KHÁC
INSERT INTO dbo.MenuItem (name, category, price, image_url)
VALUES
(N'Hotdog xúc xích mini', N'KHAC', 10000, N'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=600&auto=format&fit=crop&q=80');

-- NƯỚC GIẢI KHÁT
INSERT INTO dbo.MenuItem (name, category, price, image_url)
VALUES
(N'Pepsi', N'NUOC_GIAI_KHAT', 12000, N'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=600&auto=format&fit=crop&q=80'),
(N'Coca', N'NUOC_GIAI_KHAT', 12000, N'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&auto=format&fit=crop&q=80'),
(N'7Up', N'NUOC_GIAI_KHAT', 12000, N'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80'),
(N'Trà Ô Long', N'NUOC_GIAI_KHAT', 12000, N'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80'),
(N'Revive', N'NUOC_GIAI_KHAT', 12000, N'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&auto=format&fit=crop&q=80'),
(N'Sting', N'NUOC_GIAI_KHAT', 12000, N'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=600&auto=format&fit=crop&q=80'),
(N'Red Bull', N'NUOC_GIAI_KHAT', 13000, N'https://images.unsplash.com/photo-1543253687-c931c8e01820?w=600&auto=format&fit=crop&q=80'),
(N'Nước suối', N'NUOC_GIAI_KHAT', 7000, N'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80');
GO

-- 5. CREATE ORDERS TABLE
CREATE TABLE dbo.Orders (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    order_code VARCHAR(30) NOT NULL UNIQUE,
    customer_name NVARCHAR(150) NULL,
    customer_phone VARCHAR(20) NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount DECIMAL(12,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NULL
);
GO

-- 6. CREATE ORDER ITEM TABLE
CREATE TABLE dbo.OrderItem (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    note NVARCHAR(500) NULL,

    CONSTRAINT FK_OrderItem_Order
        FOREIGN KEY (order_id)
        REFERENCES dbo.Orders(id),

    CONSTRAINT FK_OrderItem_MenuItem
        FOREIGN KEY (menu_item_id)
        REFERENCES dbo.MenuItem(id)
);
GO

-- 7. CREATE INVOICE TABLE
CREATE TABLE dbo.Invoice (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    invoice_code VARCHAR(30) NOT NULL UNIQUE,
    order_id BIGINT NOT NULL UNIQUE,
    payment_method VARCHAR(30) NOT NULL,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'UNPAID',
    amount DECIMAL(12,2) NOT NULL,
    paid_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Invoice_Order
        FOREIGN KEY (order_id)
        REFERENCES dbo.Orders(id)
);
GO
