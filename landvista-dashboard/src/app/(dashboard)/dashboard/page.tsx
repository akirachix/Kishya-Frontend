import Layout from "./components/Layout";
import UserProfile from "./user-profiles/page";
import SplashScreen from "./teaser";

export default function Home() {
    return (
      <Layout>
        <div>
          <SplashScreen/>
          <UserProfile/>
      </div>
     </Layout>
     
    );
   }