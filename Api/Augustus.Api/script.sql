IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [TransactionCategories] (
    [Id] int NOT NULL IDENTITY,
    [ParentId] int NULL,
    [Name] nvarchar(max) NULL,
    CONSTRAINT [PK_TransactionCategories] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TransactionCategories_TransactionCategories_ParentId] FOREIGN KEY ([ParentId]) REFERENCES [TransactionCategories] ([Id])
);
GO

CREATE TABLE [Transactions] (
    [Id] int NOT NULL IDENTITY,
    [Date] datetime2 NOT NULL,
    [Description] nvarchar(max) NULL,
    [Amount] decimal(18,6) NOT NULL,
    [Category] nvarchar(max) NULL,
    [SubCategory] nvarchar(max) NULL,
    CONSTRAINT [PK_Transactions] PRIMARY KEY ([Id])
);
GO

CREATE INDEX [IX_TransactionCategories_ParentId] ON [TransactionCategories] ([ParentId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20210801135054_AddTransactionsAndCategoriesTables', N'5.0.8');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Name', N'ParentId') AND [object_id] = OBJECT_ID(N'[TransactionCategories]'))
    SET IDENTITY_INSERT [TransactionCategories] ON;
INSERT INTO [TransactionCategories] ([Id], [Name], [ParentId])
VALUES (1, N'Groceries', NULL),
(2, N'Amazon', NULL),
(3, N'Eat Out', NULL);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Name', N'ParentId') AND [object_id] = OBJECT_ID(N'[TransactionCategories]'))
    SET IDENTITY_INSERT [TransactionCategories] OFF;
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Amount', N'Category', N'Date', N'Description', N'SubCategory') AND [object_id] = OBJECT_ID(N'[Transactions]'))
    SET IDENTITY_INSERT [Transactions] ON;
INSERT INTO [Transactions] ([Id], [Amount], [Category], [Date], [Description], [SubCategory])
VALUES (1, 4.99, NULL, '2021-08-01T14:53:08.4791102+01:00', N'Tesco', NULL),
(2, 3.29, NULL, '2021-08-01T14:53:08.4814391+01:00', N'Asda', NULL),
(3, 4.99, NULL, '2021-08-01T14:53:08.4814426+01:00', N'Tesco', NULL),
(4, 3.29, NULL, '2021-08-01T14:53:08.4814469+01:00', N'Asda', NULL),
(5, 4.99, NULL, '2021-08-01T14:53:08.4814472+01:00', N'Tesco', NULL),
(6, 3.29, NULL, '2021-08-01T14:53:08.4814475+01:00', N'Asda', NULL),
(7, 4.99, NULL, '2021-08-01T14:53:08.4814527+01:00', N'Tesco', NULL),
(8, 3.29, NULL, '2021-08-01T14:53:08.4814543+01:00', N'Asda', NULL);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Amount', N'Category', N'Date', N'Description', N'SubCategory') AND [object_id] = OBJECT_ID(N'[Transactions]'))
    SET IDENTITY_INSERT [Transactions] OFF;
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Name', N'ParentId') AND [object_id] = OBJECT_ID(N'[TransactionCategories]'))
    SET IDENTITY_INSERT [TransactionCategories] ON;
INSERT INTO [TransactionCategories] ([Id], [Name], [ParentId])
VALUES (301, N'Restaurant', 3);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Name', N'ParentId') AND [object_id] = OBJECT_ID(N'[TransactionCategories]'))
    SET IDENTITY_INSERT [TransactionCategories] OFF;
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Name', N'ParentId') AND [object_id] = OBJECT_ID(N'[TransactionCategories]'))
    SET IDENTITY_INSERT [TransactionCategories] ON;
INSERT INTO [TransactionCategories] ([Id], [Name], [ParentId])
VALUES (302, N'Pub', 3);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Name', N'ParentId') AND [object_id] = OBJECT_ID(N'[TransactionCategories]'))
    SET IDENTITY_INSERT [TransactionCategories] OFF;
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Name', N'ParentId') AND [object_id] = OBJECT_ID(N'[TransactionCategories]'))
    SET IDENTITY_INSERT [TransactionCategories] ON;
INSERT INTO [TransactionCategories] ([Id], [Name], [ParentId])
VALUES (303, N'Fast-Food', 3);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Name', N'ParentId') AND [object_id] = OBJECT_ID(N'[TransactionCategories]'))
    SET IDENTITY_INSERT [TransactionCategories] OFF;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20210801135308_SeedTransactionsAndCategories', N'5.0.8');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Transactions]') AND [c].[name] = N'Category');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Transactions] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [Transactions] DROP COLUMN [Category];
GO

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Transactions]') AND [c].[name] = N'SubCategory');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Transactions] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [Transactions] DROP COLUMN [SubCategory];
GO

ALTER TABLE [Transactions] ADD [CategoryId] int NULL;
GO

ALTER TABLE [Transactions] ADD [SubCategoryId] int NULL;
GO

UPDATE [Transactions] SET [Date] = '2021-01-01T00:00:00.0000000'
WHERE [Id] = 1;
SELECT @@ROWCOUNT;

GO

UPDATE [Transactions] SET [Date] = '2021-01-02T00:00:00.0000000'
WHERE [Id] = 2;
SELECT @@ROWCOUNT;

GO

UPDATE [Transactions] SET [Date] = '2021-01-03T00:00:00.0000000'
WHERE [Id] = 3;
SELECT @@ROWCOUNT;

GO

UPDATE [Transactions] SET [Date] = '2021-01-04T00:00:00.0000000'
WHERE [Id] = 4;
SELECT @@ROWCOUNT;

GO

UPDATE [Transactions] SET [Date] = '2021-01-05T00:00:00.0000000'
WHERE [Id] = 5;
SELECT @@ROWCOUNT;

GO

UPDATE [Transactions] SET [Date] = '2021-01-06T00:00:00.0000000'
WHERE [Id] = 6;
SELECT @@ROWCOUNT;

GO

UPDATE [Transactions] SET [Date] = '2021-01-07T00:00:00.0000000'
WHERE [Id] = 7;
SELECT @@ROWCOUNT;

GO

UPDATE [Transactions] SET [Date] = '2021-01-08T00:00:00.0000000'
WHERE [Id] = 8;
SELECT @@ROWCOUNT;

GO

CREATE INDEX [IX_Transactions_CategoryId] ON [Transactions] ([CategoryId]);
GO

CREATE INDEX [IX_Transactions_SubCategoryId] ON [Transactions] ([SubCategoryId]);
GO

ALTER TABLE [Transactions] ADD CONSTRAINT [FK_Transactions_TransactionCategories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [TransactionCategories] ([Id]);
GO

ALTER TABLE [Transactions] ADD CONSTRAINT [FK_Transactions_TransactionCategories_SubCategoryId] FOREIGN KEY ([SubCategoryId]) REFERENCES [TransactionCategories] ([Id]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20210801142854_AddCategoryForeignKeysToTransactions', N'5.0.8');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var2 sysname;
SELECT @var2 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Transactions]') AND [c].[name] = N'Amount');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [Transactions] DROP CONSTRAINT [' + @var2 + '];');
ALTER TABLE [Transactions] DROP COLUMN [Amount];
GO

ALTER TABLE [Transactions] ADD [CreditAmount] decimal(18,6) NULL;
GO

ALTER TABLE [Transactions] ADD [DebitAmount] decimal(18,6) NULL;
GO

UPDATE [Transactions] SET [DebitAmount] = 4.99
WHERE [Id] = 1;
SELECT @@ROWCOUNT;

GO

UPDATE [Transactions] SET [DebitAmount] = 3.29
WHERE [Id] = 2;
SELECT @@ROWCOUNT;

GO

UPDATE [Transactions] SET [DebitAmount] = 4.99
WHERE [Id] = 3;
SELECT @@ROWCOUNT;

GO

UPDATE [Transactions] SET [DebitAmount] = 3.29
WHERE [Id] = 4;
SELECT @@ROWCOUNT;

GO

UPDATE [Transactions] SET [DebitAmount] = 4.99
WHERE [Id] = 5;
SELECT @@ROWCOUNT;

GO

UPDATE [Transactions] SET [DebitAmount] = 3.29
WHERE [Id] = 6;
SELECT @@ROWCOUNT;

GO

UPDATE [Transactions] SET [DebitAmount] = 4.99
WHERE [Id] = 7;
SELECT @@ROWCOUNT;

GO

UPDATE [Transactions] SET [DebitAmount] = 3.29
WHERE [Id] = 8;
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20220321191104_AddSeparateTransactionCreditAndDebitAmountColumns', N'5.0.8');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Transactions] ADD [UserSuppliedDescription] nvarchar(255) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20220406144537_AddTransactionUserSuppliedDescriptionColumn', N'5.0.8');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [TransactionCategories] DROP CONSTRAINT [FK_TransactionCategories_TransactionCategories_ParentId];
GO

ALTER TABLE [Transactions] DROP CONSTRAINT [FK_Transactions_TransactionCategories_CategoryId];
GO

ALTER TABLE [Transactions] DROP CONSTRAINT [FK_Transactions_TransactionCategories_SubCategoryId];
GO

ALTER TABLE [TransactionCategories] ADD CONSTRAINT [FK_TransactionCategories_TransactionCategories_ParentId] FOREIGN KEY ([ParentId]) REFERENCES [TransactionCategories] ([Id]) ON DELETE NO ACTION;
GO

ALTER TABLE [Transactions] ADD CONSTRAINT [FK_Transactions_TransactionCategories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [TransactionCategories] ([Id]) ON DELETE NO ACTION;
GO

ALTER TABLE [Transactions] ADD CONSTRAINT [FK_Transactions_TransactionCategories_SubCategoryId] FOREIGN KEY ([SubCategoryId]) REFERENCES [TransactionCategories] ([Id]) ON DELETE NO ACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20220718173113_AlterTransactionCategoryDeleteBehaviour', N'5.0.8');
GO

COMMIT;
GO

