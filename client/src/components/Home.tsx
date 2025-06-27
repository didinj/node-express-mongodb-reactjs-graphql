import { Link } from "react-router-dom";
import "../App.css";
import { gql, useQuery } from "@apollo/client";

const GET_BOOKS = gql`
  {
    books {
      _id
      title
      author
    }
  }
`;

interface Book {
  _id: string;
  title: string;
  author: string;
}

interface GetBooksData {
  books: Book[];
}

function Home() {
  const { loading, error, data } = useQuery<GetBooksData>(GET_BOOKS, {
    pollInterval: 500
  });

  if (loading) return <>Loading...</>;
  if (error) return <>Error! {error.message}</>;

  return (
    <div className="container">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">LIST OF BOOKS</h3>
          <h4>
            <Link to="/create">Add Book</Link>
          </h4>
        </div>
        <div className="panel-body">
          <table className="table table-stripe">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
              </tr>
            </thead>
            <tbody>
              {data?.books.map((book) => (
                <tr key={book._id}>
                  <td>
                    <Link to={`/show/${book._id}`}>{book.title}</Link>
                  </td>
                  <td>{book.author}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;
