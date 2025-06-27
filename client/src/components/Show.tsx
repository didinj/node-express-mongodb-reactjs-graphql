import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../App.css";
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

const DELETE_BOOK = gql`
  mutation removeBook($id: String!) {
    removeBook(id: $id) {
      _id
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

interface DeleteBookResult {
  removeBook: { _id: string };
}

interface DeleteBookVars {
  id: string;
}

const Show: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery<GetBookData, GetBookVars>(
    GET_BOOK,
    {
      variables: { bookId: id || "" },
      pollInterval: 500
    }
  );

  const [removeBook, { loading: deleteLoading, error: deleteError }] =
    useMutation<DeleteBookResult, DeleteBookVars>(DELETE_BOOK, {
      onCompleted: () => navigate("/")
    });

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (data?.book._id) {
      removeBook({ variables: { id: data.book._id } });
    }
  };

  if (loading) return <>Loading...</>;
  if (error) return <>Error! {error.message}</>;

  const book = data?.book;

  return (
    <div className="container">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h4>
            <Link to="/">Book List</Link>
          </h4>
          <h3 className="panel-title">{book?.title}</h3>
        </div>
        <div className="panel-body">
          <dl>
            <dt>ISBN:</dt>
            <dd>{book?.isbn}</dd>
            <dt>Author:</dt>
            <dd>{book?.author}</dd>
            <dt>Description:</dt>
            <dd>{book?.description}</dd>
            <dt>Published Year:</dt>
            <dd>{book?.published_year}</dd>
            <dt>Publisher:</dt>
            <dd>{book?.publisher}</dd>
            <dt>Updated:</dt>
            <dd>{book?.updated_date}</dd>
          </dl>

          <form onSubmit={handleDelete}>
            <Link to={`/edit/${book?._id}`} className="btn btn-success">
              Edit
            </Link>
            &nbsp;
            <button type="submit" className="btn btn-danger">
              Delete
            </button>
          </form>

          {deleteLoading && <p>Loading...</p>}
          {deleteError && <p>Error :( Please try again</p>}
        </div>
      </div>
    </div>
  );
};

export default Show;
