import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a PDF file');

    setLoading(true);

    const reader = new FileReader();

    reader.onload = async () => {
      // SAFER base64 extract
      const base64Data = reader.result.replace(/^data:.*;base64,/, "");

      console.log("Sending file:", file.name);
      console.log("Base64 Sample:", base64Data.substring(0, 80));

      try {
        const response = await axios.post(
          'https://wj3v40q2rl.execute-api.ap-southeast-2.amazonaws.com/prod/upload',
          {
            fileName: file.name,
            fileContent: base64Data,
            name,
            age
          },
          {
            headers: { "Content-Type": "application/json" }
          }
        );

        alert(response.data.message || 'PDF uploaded successfully!');

        setName('');
        setAge('');
        setFile(null);

      } catch (err) {
        console.error("UPLOAD ERROR:", err);
        alert(err.response?.data?.error || 'Upload failed');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="App">
      <h1>PDF Upload Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Age:</label>
          <input
            type="number"
            placeholder="Enter age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>

        <div>
          <label>PDF File:</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </form>
    </div>
  );
}

export default App;
