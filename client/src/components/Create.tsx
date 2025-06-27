import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";

const ADD_BOOK = gql`
  mutation AddBook(
    $isbn: String!
    $title: String!
    $author: String!
    $description: String!
    $publisher: String!
    $published_year: Int!
  ) {
    addBook(
      isbn: $isbn
      title: $title
      author: $author
      description: $description
      publisher: $publisher
      published_year: $published_year
    ) {
      _id
    }
  }
`;

interface AddBookInput {
  isbn: string;
  title: string;
  author: string;
  description: string;
  publisher: string;
  published_year: number;
}

interface AddBookResponse {
  addBook: {
    _id: string;
  };
}

const Create: React.FC = () => {
  const navigate = useNavigate();

  const [formState, setFormState] = useState<AddBookInput>({
    isbn: "",
    title: "",
    author: "",
    description: "",
    publisher: "",
    published_year: new Date().getFullYear()
  });

  const [addBook, { loading, error }] = useMutation<
    AddBookResponse,
    AddBookInput
  >(ADD_BOOK, {
    onCompleted: () => navigate("/")
  });

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
    addBook({ variables: formState });
  };

  return (
    <div className="container">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">ADD BOOK</h3>
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
                placeholder="ISBN"
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
                placeholder="Title"
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
                placeholder="Author"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                className="form-control"
                name="description"
                value={formState.description}
                onChange={handleChange}
                placeholder="Description"
                cols={80}
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
                placeholder="Publisher"
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
                placeholder="Published Year"
              />
            </div>
            <button type="submit" className="btn btn-success">
              Submit
            </button>
          </form>

          {loading && <p>Loading...</p>}
          {error && <p>Error :( Please try again</p>}
        </div>
      </div>
    </div>
  );
};

export default Create;
