USE bookish;

CREATE TABLE Book (
	BookId INT IDENTITY(1, 1) PRIMARY KEY,
	Title NVARCHAR(500) NOT NULL,
	ISBN NVARCHAR(13) NOT NULL UNIQUE,
	TotalCopies INT NOT NULL CHECK (TotalCopies >= 0)
);

CREATE TABLE Author (
	AuthorId INT IDENTITY(1, 1) PRIMARY KEY,
	Name NVARCHAR(255) NOT NULL
);

CREATE TABLE Book_Author (
	BookId INT NOT NULL,
	AuthorId INT NOT NULL,

	CONSTRAINT FK_Book_Author_Book
		FOREIGN KEY (BookId)
		REFERENCES Book(BookId),

	CONSTRAINT FK_Book_Author_Author
		FOREIGN KEY (AuthorId)
		REFERENCES Author(AuthorId),

	CONSTRAINT PK_Book_Author
		PRIMARY KEY (BookId, AuthorId)
);

CREATE TABLE Customer (
	CustomerId INT IDENTITY(1, 1) PRIMARY KEY,
	Username NVARCHAR(100) NOT NULL UNIQUE,
	PlainPassword NVARCHAR(500) NOT NULL
);

CREATE TABLE Loan (
	LoanId INT IDENTITY(1, 1) PRIMARY KEY,

	BookId INT NOT NULL,
	CustomerId INT NOT NULL,
	DueDate DATE NOT NULL,

	CONSTRAINT FK_Loan_Book
		FOREIGN KEY (BookId)
		REFERENCES Book(BookId),

	CONSTRAINT FK_Loan_Customer
		FOREIGN KEY (CustomerId)
		REFERENCES Customer(CustomerId),
);

CREATE TABLE AccessToken (
	TokenId INT IDENTITY(1, 1) PRIMARY KEY,
	CustomerId INT NOT NULL,
	Token NVARCHAR(1000) NOT NULL,
	CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

	CONSTRAINT FK_AccessToken_Customer
		FOREIGN KEY (CustomerId)
		REFERENCES Customer(CustomerId)
);

CREATE INDEX IX_Book_Title ON Book(Title);
CREATE INDEX IX_Author_Name ON Author(Name);