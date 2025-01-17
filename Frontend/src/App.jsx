import { Layout } from 'antd';
import Header from './components/page1/Header/Header';
import Sider from './components/page1/Sider/Sider';
import { ThemeProvider } from './components/page1/Sider/ThemeContext';
import Content from './components/page1/Content/Content';
import CustomFooter from './components/page1/Footer/Footer';

export default function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Header />
        <Layout>
          <Sider />
          <Content />
        </Layout>
        <CustomFooter />
      </Layout>
    </ThemeProvider>
  );
}
