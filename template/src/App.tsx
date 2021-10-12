import React from 'react';
import { Button } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';
import logo from './logo.svg';
import styles from './App.module.less';

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <img src={logo} className={styles.logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Button
          href="https://ant.design/"
          icon={<AntDesignOutlined />}
          size="large"
          type="primary"
        >
          Learn Ant Design
        </Button>
      </header>
    </div>
  );
}

export default App;
