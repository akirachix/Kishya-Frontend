import Layout from "./components/Layout";
// import Feedback from "./Feedback/page";
// import AddUserData from "./add-user-data/page";
import UserProfile from "./user-profiles/page";

export default function Home() {
    return (
      <Layout>
        <div>
          <UserProfile/>
        
      </div>
     </Layout>
     
    );
   }