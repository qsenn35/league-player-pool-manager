import { Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CreatePoolForm, JoinPoolForm } from '../../components';

const { TabPane } = Tabs;

const Home = () => {
  const navigate = useNavigate();

  const handleCreatePool = async (poolData) => {
    console.log(poolData);
    try {
      const request = await fetch('http://localhost:3000/pools/create', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(poolData)
      });
      const response = await request.json();

      if (request.status === 200 && !response.error) {
        console.log(response);
        navigate(`/pools/edit/${response.id}`);
      } else if (response.error) {
        // show error alert
        console.error(response.error);
      }
      console.log(response);
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Join Pool" key="1">
        <JoinPoolForm/>
      </TabPane>
      <TabPane tab="Create Pool" key="2">
        <CreatePoolForm handleSubmit={handleCreatePool} handleChange={() => {}} />
      </TabPane>
    </Tabs>
  )
}

export default Home;