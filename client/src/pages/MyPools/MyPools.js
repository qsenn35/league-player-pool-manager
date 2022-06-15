import { Link } from "react-router-dom";
import { notification, Table } from "antd";
import { useEffect, useState } from "react";
import { SERVER_URL } from "../../constants";
import { useUserContext } from "../../hooks";

const columns = [
  {
    title: "Pool ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Created",
    dataIndex: "created",
    key: "created",
  },
  {
    title: "Operations",
    render: (_, record) => (
      <div>
        <Link to={`/pools/view/${record.id}`}>View </Link>
        <Link to={`/pools/edit/${record.id}`}>Edit</Link>
      </div>
    )
  }
]

const MyPools = () => {
  const [user] = useUserContext();
  const [pools, setPools] = useState([]);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const request = await fetch(`${SERVER_URL}/pools`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            mode: "no-cors",
          }
        });
        
        const response = await request.json();
  
        if (response.error) {
          notification.error({
            message: "Error!",
            description: response.error,
          });
          return [];
        }
        
        return response;
      } catch(error) {
        console.error(error);
        notification.error({
          message: "Error!",
          description: "An unknown error occurred.",
        })
      }
    }
    
    fetchPools().then((pools) => setPools(pools));
  }, [user.accessToken])

  return (
    <div className="MyPools">
      <div className="MyPools__title">
        <h1>My Pools</h1>
      </div>
      <div className="MyPools__pools-list">
        <Table dataSource={pools} columns={columns} />
      </div>
    </div>
  )
}

export default MyPools;