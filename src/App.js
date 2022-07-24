import "./App.css";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Shelves from "./components/Shelves";
import * as BooksAPI from "./BooksAPI";
import Book from "./components/Book";
import { Routes, Route, Link } from "react-router-dom";
function App() {
  const [books, setBooks] = useState([]);

  const [query, setQuery] = useState("");

  const [searchedBooks, setSearchedBooks] = useState([]);

  //To get he books for main page
  useEffect(() => {
    // BooksAPI.getAll().then((data) => {
    //   console.log(data);
    //   setBooks(data);
    // });
    const getBooks = async () => {
      const res = await BooksAPI.getAll();
      setBooks(res);
      setMapOfIdBooks(createMapOfBooks(res));
    };
    getBooks();
  }, []);
  //If I add the [], it means when the component did mount, call this function, so it runs once
  //If I don't add the [] at all, this function will run every time I make any change or refresh
  //If I add a specific state inside the [], so [books], the function will run every time a change happens to that state

  //To update the books' shelf so they show even after refresh
  const changeBookShelf = (book, shelf) => {
    const updatedBooks = books.map((b) => {
      if (b.id === book.id) {
        book.shelf = shelf;
      }
      return b;
    });
    if (!mapOfIdBooks.has(book.id)) {
      book.shelf = shelf;
      updatedBooks.push(book);
    } //This if statement makes sure that when we add a book to a shelf using the search page, it adds immediately without the need to refresh
    setBooks(updatedBooks);
    BooksAPI.update(book, shelf);
  };

  //To search for the correct book on the search page
  useEffect(() => {
    //When I type in the search bar, every letter I type it makes change to query state, so this function will run and it will get a data, but each data I get with each entry don't get cleaned, so if I seach for "pro", the page will show the books/data for "p" and "pr" and "pro" all together
    let isMounted = true;
    if (query) {
      BooksAPI.search(query).then((data) => {
        if (data.error) {
        } else {
          if (isMounted) {
            setSearchedBooks(data);
          }
        }
      });
    }
    return () => {
      isMounted = false;
      setSearchedBooks([]);
    }; //When we add a function to the return of useEffect, it will run when the component is unmounted
  }, [query]);
  //This means this will run only when query changes

  //The logic for making the books that shows on search page have the correct shelf if they are already in one of the shelves
  const [mergedBooks, setMergedBooks] = useState([]);
  const [mapOfIdBooks, setMapOfIdBooks] = useState(new Map());

  const createMapOfBooks = (books) => {
    const map = new Map();
    books.forEach((book) => map.set(book.id, book));
    return map;
  };
  useEffect(() => {
    const combinedArrays = searchedBooks.map((book) => {
      if (mapOfIdBooks.has(book.id)) {
        return mapOfIdBooks.get(book.id);
      } else {
        return book;
      }
    });
    setMergedBooks(combinedArrays);
  }, [searchedBooks, mapOfIdBooks]);

  return (
    <div className="app">
      <Routes>
        {/* Search Page */}
        <Route
          path="/search"
          element={
            <div className="search-books">
              <div className="search-books-bar">
                <Link to={"/"} className="close-search">
                  Close
                </Link>
                <div className="search-books-input-wrapper">
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by title, author, or ISBN"
                  />
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid">
                  {mergedBooks.map((b) => (
                    <li key={b.id}>
                      <Book book={b} changeBookShelf={changeBookShelf} />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          }
        />

        {/* Main Page */}
        <Route
          exact
          path="/"
          element={
            <div className="list-books">
              <Header />
              <div className="list-books-content">
                <Shelves books={books} changeBookShelf={changeBookShelf} />
              </div>
              <div className="open-search">
                <Link to={"/search"}>Add a book</Link>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
