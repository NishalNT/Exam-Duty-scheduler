import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddExamDetails = () => {
  const [examDetails, setExamDetails] = useState({
    examName: '',
    examDate: '',
    examTime: '',
  });
  const [message, setMessage] = useState('');
  const [examData, setExamData] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);

  const handleChange = (e) => {
    setExamDetails({
      ...examDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3106/addExamdate', examDetails);
      console.log('Exam details added:', response.data);
      setMessage('Exam details added successfully!');
      setTimeout(() => {
        setExamDetails({ examName: '', examDate: '', examTime: '' });
        setMessage('');
        fetchExamData();
        setSelectedExam(null);
      }, 2000);
    } catch (error) {
      console.error('Error adding exam details:', error);
      setMessage('Error adding exam details.');
    }
  };

  const fetchExamData = async () => {
    try {
      const response = await axios.get('http://localhost:3106/getExamDetails'); // Change the endpoint to the correct one
      setExamData(response.data);
    } catch (error) {
      console.error('Error fetching exam data:', error);
      setMessage('Error fetching exam data.');
    }
  };
  

  useEffect(() => {
    fetchExamData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3106/deletedate/${id}`);
      setMessage('Exam details deleted successfully!');
      fetchExamData();
    } catch (error) {
      console.error('Error deleting exam details:', error);
      setMessage('Error deleting exam details.');
    }
  };

  const handleUpdate = (exam) => {
    setExamDetails({
      examName: exam.examName,
      examDate: exam.examDate,
      examTime: exam.examTime,
    });
    setSelectedExam(exam);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3106/api/exam-details/${selectedExam._id}`, examDetails);
      console.log('Exam details updated:', response.data);
      setMessage('Exam details updated successfully!');
      setTimeout(() => {
        setExamDetails({ examName: '', examDate: '', examTime: '' });
        setMessage('');
        fetchExamData();
        setSelectedExam(null);
      }, 2000);
    } catch (error) {
      console.error('Error updating exam details:', error);
      setMessage('Error updating exam details.');
    }
  };

  return (
    <section className="min-h-screen flex flex-col gap-4 items-center justify-center p-5 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">{selectedExam ? 'Update Exam Details' : 'Add Exam Details'}</h1>
        <form onSubmit={selectedExam ? handleUpdateSubmit : handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Exam Name:</label>
            <input
              type="text"
              name="examName"
              value={examDetails.examName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Exam Date:</label>
            <input
              type="date"
              name="examDate"
              value={examDetails.examDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
  <label className="block mb-2 text-sm font-medium text-gray-700">From:</label>
  <input
    type="time"
    name="startTime"
    value={examDetails.startTime}
    onChange={handleChange}
    required
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
  />
</div>
<div>
  <label className="block mb-2 text-sm font-medium text-gray-700">To:</label>
  <input
    type="time"
    name="endTime"
    value={examDetails.endTime}
    onChange={handleChange}
    required
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
  />
</div>

          <button type="submit" className="w-full bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
            {selectedExam ? 'Update Exam' : 'Add Exam'}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-green-500">{message}</p>}
      </div>
      <div className="bg-white p-8 items-center text-center rounded-lg shadow-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">All Exams</h1>
        <table className="table-auto w-full my-4">
          <tbody>
            <tr>
              <th className="px-4 py-2 border border-gray-300">Exam Name</th>
              <th className="px-4 py-2 border border-gray-300">Exam Date</th>
              <th className="px-4 py-2 border border-gray-300">Start Time</th>
              <th className="px-4 py-2 border border-gray-300">End Time</th>
              <th className="px-4 py-2 border border-gray-300">Action</th>
            </tr>
            {examData.map((exam) => (
              <tr key={exam._id}>
                <td className="px-4 py-2 border border-gray-300">{exam.examName}</td>
                <td className="px-4 py-2 border border-gray-300">{exam.examDate}</td>
                <td className="px-4 py-2 border border-gray-300">{exam.startTime}</td>
                <td className="px-4 py-2 border border-gray-300">{exam.endTime}</td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                    onClick={() => handleDelete(exam._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    onClick={() => handleUpdate(exam)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AddExamDetails;
