import Layout from "./components/Layout";
import Feedback from "./Feedback/page";
import AddUserData from "./add-user-data/page";

export default function Home() {
    return (
      <Layout>
        <div>
       <AddUserData/>
      <Feedback/>
      </div>
     </Layout>
     
    );
   }