import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';

const Tasks = () => {
  const authState = useSelector(state => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [fetchData, { loading }] = useFetch();

  const fetchTasks = useCallback(() => {
    const config = { url: "/tasks", method: "get", headers: { Authorization: authState.token } };
    fetchData(config, { showSuccessToast: false }).then(data => setTasks(data.tasks));
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const handleDelete = (id) => {
    const config = { url: `/tasks/${id}`, method: "delete", headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchTasks());
  }

  return (
    <div className="my-6 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
        {tasks.length > 0 && (
          <Link 
            to="/tasks/add" 
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i className="fas fa-plus mr-2"></i> Add New Task
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
              <div className="mt-6">
                <Link
                  to="/tasks/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <i className="fas fa-plus -ml-1 mr-2 h-5 w-5"></i>
                  New Task
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white px-4 py-3 shadow-sm rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500">
                    Showing <span className="font-bold text-gray-700">{tasks.length}</span> tasks
                  </span>
                </div>
              </div>
              
              {tasks.map((task, index) => (
                <div key={task._id} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.status === "complete" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {task.status === "complete" ? "Completed" : "Pending"}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">Task #{index + 1}</span>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex">
                        <Tooltip text={"Edit this task"} position={"top"}>
                          <Link 
                            to={`/tasks/${task._id}`} 
                            className="bg-white rounded-full p-1.5 text-gray-400 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <i className="fas fa-pen h-4 w-4"></i>
                          </Link>
                        </Tooltip>
                        <Tooltip text={"Delete this task"} position={"top"}>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="ml-2 bg-white rounded-full p-1.5 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <i className="fas fa-trash h-4 w-4"></i>
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">{task.title}</h3>
                      <div className="mt-2 max-w-xl text-sm text-gray-500 whitespace-pre-line">
                        {task.description}
                      </div>
                    </div>
                    <div className="mt-5 border-t border-gray-200 pt-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500">
                        <div className="mb-2 sm:mb-0">
                          <span className="font-medium">Created:</span> {new Date(task.createdAt).toLocaleString()}
                        </div>
                        {task.status === "complete" && (
                          <div>
                            <span className="font-medium">Completed:</span> {new Date(task.completedAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Tasks;