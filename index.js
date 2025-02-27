require("dotenv").config();
const express = require("express");
const { initializeDatabase } = require("./db/db.connect");
const Books = require("./models/books.model");
const app = express();

app.use(express.json());

initializeDatabase();

// function to create a new book data into database.
async function createBook(bookData) {
  try {
    const newBook = new Books(bookData);
    const savedBook = await newBook.save();
    return savedBook;
  } catch (error) {
    console.log(error);
  }
}

app.post("/books", async (req, res) => {
  try {
    const savedBook = await createBook(req.body);
    if (savedBook) {
      res.status(200).json({
        message: "New book data created successfully in the database.",
        book: savedBook,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// function to read all books from the database.
async function readAllBooks() {
  try {
    const booksData = await Books.find();
    return booksData;
  } catch (error) {
    console.log(error);
  }
}

app.get("/books", async (req, res) => {
  try {
    const booksData = await readAllBooks();
    if (booksData.length != 0) {
      res.status(200).json({ booksData });
    } else {
      res.status(404).json({ error: "No books data found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// function to get books details by its title
async function readBookByTitle(bookTitle) {
  try {
    const bookByTitle = await Books.findOne({ title: bookTitle });
    return bookByTitle;
  } catch (error) {
    console.log(error);
  }
}

app.get("/books/:bookTitle", async (req, res) => {
  try {
    const bookByTitle = await readBookByTitle(req.params.bookTitle);
    if (bookByTitle) {
      res
        .status(200)
        .json({ message: "Book found successfully.", book: bookByTitle });
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// function to get details of all the books by an author.
async function readBooksByAuthor(authorName) {
  try {
    const booksByAuthor = await Books.find({ author: authorName });
    return booksByAuthor;
  } catch (error) {
    console.log(error);
  }
}

app.get("/books/author/:authorName", async (req, res) => {
  try {
    const booksByAuthor = await readBooksByAuthor(req.params.authorName);
    if (booksByAuthor.length != 0) {
      res.status(200).json({
        message: `Successfully found all books by author ${req.params.authorName}`,
        booksByAuthor,
      });
    } else {
      res.status(404).json({ error: "No books found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// function to get all the books which are of genre Business
async function readBooksByGenre(bookGenre) {
  try {
    const booksByGenre = await Books.find({ genre: bookGenre });
    return booksByGenre;
  } catch (error) {
    console.log(error);
  }
}

app.get("/books/genre/:genreName", async (req, res) => {
  try {
    const booksByGenre = await readBooksByGenre(req.params.genreName);
    if (booksByGenre.length != 0) {
      res.status(200).json({
        messages: `Successfully found books by genre ${req.params.genreName}`,
        booksByGenre,
      });
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// function to get all the books which was released in the year 2012
async function readBooksByReleaseYear(year) {
  try {
    const booksByReleaseYear = await Books.find({ publishedYear: year });
    return booksByReleaseYear;
  } catch (error) {
    console.log(error);
  }
}
app.get("/books/publishedYear/:publishedYear", async (req, res) => {
  try {
    const books = await readBooksByReleaseYear(req.params.publishedYear);
    if (books.length != 0) {
      res.status(200).json({
        message: `Successfully found books published in ${req.params.publishedYear}`,
        books,
      });
    } else {
      res.status(404).json({ error: "No books found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// function to update a book's rating with the help of its id.
async function updateBookById(bookId, dataToUpdate) {
  try {
    const updatedBook = await Books.findByIdAndUpdate(bookId, dataToUpdate, {
      new: true,
    });
    return updatedBook;
  } catch (error) {
    console.log(error);
  }
}
app.post("/books/:bookId", async (req, res) => {
  try {
    const updatedBook = await updateBookById(req.params.bookId, req.body);
    if (updatedBook) {
      res
        .status(200)
        .json({ message: "Book updated successfully.", book: updatedBook });
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// function to update a book's rating with the help of its title.
async function updateBookByTitle(bookTitle, dataToUpdate) {
  try {
    const updatedBook = await Books.findOneAndUpdate(bookTitle, dataToUpdate, {
      new: true,
    });
    return updatedBook;
  } catch (error) {
    console.log(error);
  }
}
app.post("/books/title/:bookTitle", async (req, res) => {
  try {
    const updatedBook = await updateBookByTitle(
      { title: req.params.bookTitle },
      req.body
    );
    if (updatedBook) {
      res
        .status(200)
        .json({ message: "Book updated successfully.", book: updatedBook });
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// function to delete a book with the help of a book id.
async function deleteBookById(bookId) {
  try {
    const deletedBook = await Books.findByIdAndDelete(bookId);
    return deletedBook;
  } catch (error) {
    console.log(error);
  }
}
app.delete("/books/:bookId", async (req, res) => {
  try {
    const deletedBook = await deleteBookById(req.params.bookId);
    console.log(deletedBook);
    if (deletedBook) {
      res.status(200).json({ message: "Book deleted succesfully" });
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
