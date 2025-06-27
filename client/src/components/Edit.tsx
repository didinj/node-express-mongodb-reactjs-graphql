import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_BOOK = gql`
  query book($bookId: String) {
    book(id: $bookId) {
      _id
      isbn
      title
      author
      description
      published_year
      publisher
      updated_date
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation updateBook(
    $id: String!
    $isbn: String!
    $title: String!
    $author: String!
    $description: String!
    $publisher: String!
    $published_year: Int!
  ) {
    updateBook(
      id: $id
      isbn: $isbn
      title: $title
      author: $author
      description: $description
      publisher: $publisher
      published_year: $published_year
    ) {
      updated_date
    }
  }
`;

interface Book {
  _id: string;
  isbn: string;
  title: string;
  author: string;
  description: string;
  published_year: number;
  publisher: string;
  updated_date: string;
}

interface GetBookData {
  book: Book;
}

interface GetBookVars {
  bookId: string;
}

interface UpdateBookVars {
  id: string;
  isbn: string;
  title: string;
  author: string;
  description: string;
  publisher: string;
  published_year: number;
}

const Edit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery<GetBookData, GetBookVars>(
    GET_BOOK,
    {
      variables: { bookId: id || "" }
    }
  );

  const [updateBook, { loading: updateLoading, error: updateError }] =
    useMutation<{ updateBook: { updated_date: string } }, UpdateBookVars>(
      UPDATE_BOOK,
      {
        onCompleted: () => navigate("/")
      }
    );

  const [formState, setFormState] = useState<UpdateBookVars>({
    id: "",
    isbn: "",
    title: "",
    author: "",
    description: "",
    publisher: "",
    published_year: new Date().getFullYear()
  });

  // Initialize form with book data
  useEffect(() => {
    if (data?.book) {
      const b = data.book;
      setFormState({
        id: b._id,
        isbn: b.isbn,
        title: b.title,
        author: b.author,
        description: b.description,
        publisher: b.publisher,
        published_year: b.published_year
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === "published_year" ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBook({ variables: formState });
  };

  if (loading) return <>Loading...</>;
  if (error) return <>Error! {error.message}</>;

  return (
    <div className="container">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">EDIT BOOK</h3>
        </div>
        <div className="panel-body">
          <h4>
            <Link to="/" className="btn btn-primary">
              Book List
            </Link>
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="isbn">ISBN:</label>
              <input
                type="text"
                className="form-control"
                name="isbn"
                value={formState.isbn}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formState.title}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="author">Author:</label>
              <input
                type="text"
                className="form-control"
                name="author"
                value={formState.author}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                className="form-control"
                name="description"
                value={formState.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label htmlFor="publisher">Publisher:</label>
              <input
                type="text"
                className="form-control"
                name="publisher"
                value={formState.publisher}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="published_year">Published Year:</label>
              <input
                type="number"
                className="form-control"
                name="published_year"
                value={formState.published_year}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-success">
              Submit
            </button>
          </form>
          {updateLoading && <p>Updating...</p>}
          {updateError && <p>Error :( Please try again</p>}
        </div>
      </div>
    </div>
  );
};

export default Edit;
