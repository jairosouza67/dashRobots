import { BrowserRouter, Routes, Route } from "react-router-dom";

const TestComponent = () => (
  <div className="min-h-screen bg-background p-8">
    <h1 className="text-4xl font-bold text-center">RespiraZen - Teste</h1>
    <p className="text-center mt-4">Se você está vendo esta página, a aplicação está funcionando!</p>
  </div>
);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<TestComponent />} />
    </Routes>
  </BrowserRouter>
);

export default App;