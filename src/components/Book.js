const Book = ({ book, changeBookShelf }) => {
  return (
    <div className="book">
      <div className="book-top">
        <div
          className="book-cover"
          style={{
            width: 128,
            height: 193,
            backgroundImage: `url("${
              book.imageLinks ? book.imageLinks.thumbnail : null
            }")`,
          }}
        ></div>
        <div className="book-shelf-changer">
          <select
            defaultValue={book.shelf ? book.shelf : "none"}
            onChange={(event) => {
              changeBookShelf(book, event.target.value);
            }}
          >
            <option value="moveto" disabled>
              Move to...
            </option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
      <div className="book-title">{book.title}</div>
      <div className="book-authors">
        {book.authors ? book.authors[0] : null}
      </div>
    </div>
  );
};
export default Book;
