import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Dashboard, ActionHub, AdvisoryConsole, RawData } from '@/pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="actions" element={<ActionHub />} />
          <Route path="advisory" element={<AdvisoryConsole />} />
          <Route path="raw-data" element={<RawData />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
