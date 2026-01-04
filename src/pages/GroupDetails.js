import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GroupService from '../apis/group';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ContactService from '../apis/contact';
import { Button } from 'react-bootstrap';
import AddTaskModal from './AddTaskModal';
import BuiltInTaskModal from './BuiltInTaskModal';
import TasksList from './TasksList';
import PollsList from './PollsList';
import GroupChat from './GroupChat';
import axios from 'axios';

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [polls, setPolls] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showNewPollModal, setShowNewPollModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', deadline: '' });
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
    deadline: ''
  });
  const [builtInTasks, setBuiltInTasks] = useState([
    {
      id: 1,
      title: "Daily Quran Reading",
      description: "Read at least one page of Quran daily",
      category: "Quran",
      isBuiltIn: true
    },
    {
      id: 2,
      title: "Daily Dhikr",
      description: "Perform morning and evening dhikr",
      category: "Dhikr",
      isBuiltIn: true
    },
    {
      id: 3,
      title: "Weekly Hadith Discussion",
      description: "Read and discuss one hadith per week",
      category: "Hadith",
      isBuiltIn: true
    },
    {
      id: 4,
      title: "Tafsir Study",
      description: "Study Quranic commentary and interpretation",
      category: "Quran",
      isBuiltIn: true
    },
    {
      id: 5,
      title: "Memorize Surah",
      description: "Memorize a new surah or portion of the Quran",
      category: "Quran",
      isBuiltIn: true
    },
    {
      id: 6,
      title: "Islamic History",
      description: "Learn about important events in Islamic history",
      category: "History",
      isBuiltIn: true
    },
    {
      id: 7,
      title: "Tahajjud Prayer",
      description: "Establish the night prayer regularly",
      category: "Prayer",
      isBuiltIn: true
    },
    {
      id: 8,
      title: "Daily Dua Practice",
      description: "Learn and practice new duas for different situations",
      category: "Dua",
      isBuiltIn: true
    },
    {
      id: 9,
      title: "Seerah Study",
      description: "Study the life and character of Prophet Muhammad (PBUH)",
      category: "Seerah",
      isBuiltIn: true
    },
    {
      id: 10,
      title: "Fiqh Discussions",
      description: "Learn about Islamic jurisprudence and rulings",
      category: "Fiqh",
      isBuiltIn: true
    },
    {
      id: 11,
      title: "Islamic Ethics",
      description: "Study and implement Islamic ethics and character development",
      category: "Ethics",
      isBuiltIn: true
    },
    {
      id: 12,
      title: "Daily Salawat",
      description: "Send blessings upon the Prophet Muhammad (PBUH) daily",
      category: "Dhikr",
      isBuiltIn: true
    },
    {
      id: 13,
      title: "Charity Tracker",
      description: "Track regular charitable giving and acts of kindness",
      category: "Charity",
      isBuiltIn: true
    },
    {
      id: 14,
      title: "Tajweed Practice",
      description: "Improve Quranic recitation with proper rules of tajweed",
      category: "Quran",
      isBuiltIn: true
    },
    {
      id: 15,
      title: "Islamic Book Club",
      description: "Read and discuss Islamic books with group members",
      category: "Education",
      isBuiltIn: true
    },
    {
      id: 16,
      title: "Weekly Reflection",
      description: "Reflect on personal spiritual growth and set improvement goals",
      category: "Self-development",
      isBuiltIn: true
    },
    {
      id: 17,
      title: "Arabic Language Study",
      description: "Learn basic Arabic vocabulary and grammar for Quran understanding",
      category: "Language",
      isBuiltIn: true
    },
    {
      id: 18,
      title: "Sunnah Practices",
      description: "Implement the daily Sunnah practices of the Prophet (PBUH)",
      category: "Sunnah",
      isBuiltIn: true
    },
    {
      id: 19,
      title: "Quranic Vocabulary",
      description: "Learn and review common words used in the Quran",
      category: "Quran",
      isBuiltIn: true
    },
    {
      id: 20,
      title: "Community Service",
      description: "Organize or participate in community service activities",
      category: "Community",
      isBuiltIn: true
    }
  ]);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [userContacts, setUserContacts] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isProgressHidden, setIsProgressHidden] = useState(false);
  const modalRef = useRef(null);
  const [showTaskMembersModal, setShowTaskMembersModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showPollVotesModal, setShowPollVotesModal] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showBuiltInTaskModal, setShowBuiltInTaskModal] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuiltInTask, setSelectedBuiltInTask] = useState(null);
  const [builtInTaskDeadline, setBuiltInTaskDeadline] = useState('');

  // User Task List states
  const [showUserTaskListModal, setShowUserTaskListModal] = useState(false);
  const [userTaskList, setUserTaskList] = useState([]);
  const [userTaskListLoading, setUserTaskListLoading] = useState(false);

  // Search states
  const [builtInTaskSearch, setBuiltInTaskSearch] = useState('');
  const [userTaskListSearch, setUserTaskListSearch] = useState('');
  const [taskTabSearch, setTaskTabSearch] = useState('');
  const [pollTabSearch, setPollTabSearch] = useState('');

  useEffect(() => {
    loadGroupDetails();
  }, [groupId]);

  const loadGroupDetails = async () => {
    try {
      setLoading(true);
      const response = await GroupService.getGroupDetails(groupId);
      console.log(response);
      if (response.data) {
        setGroup(response.data.group);
        setTasks(response.data.tasks);
        setPolls(response.data.polls);

        // Set progress visibility state
        if (response.data.userPreferences) {
          setIsProgressHidden(response.data.userPreferences.isProgressHidden);
        }
      }
    } catch (error) {
      toast.error('Failed to load group details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = (taskData) => {
    // Create optimistic task immediately
    const tempId = 'temp-' + Date.now();
    const optimisticTask = {
      _id: tempId,
      title: taskData.title || newTask.title,
      description: taskData.description || newTask.description,
      deadline: taskData.deadline || newTask.deadline,
      group: groupId,
      usersCompleted: [],
      createdAt: new Date().toISOString(),
      isOptimistic: true
    };

    // Immediately add to UI and close modal
    setTasks(prev => [optimisticTask, ...prev]);
    setShowAddTaskModal(false);
    setNewTask({ title: '', description: '', deadline: '', saveToList: false });
    toast.success('Task created successfully');

    // Save to user's task list if checkbox was checked (fire and forget)
    if (taskData.saveToList || newTask.saveToList) {
      handleAddToUserTaskList({
        title: taskData.title || newTask.title,
        description: taskData.description || newTask.description,
        category: 'Custom',
        isBuiltIn: false
      });
    }

    // API call runs silently in background (fire and forget pattern)
    GroupService.addTask(groupId, taskData)
      .then(serverTask => {
        // Replace optimistic task with real task from server
        console.log('Task API response:', serverTask);
        // serverTask should be the task object directly with _id
        if (serverTask && serverTask._id) {
          console.log('Replacing temp task', tempId, 'with real task', serverTask._id);
          setTasks(prev => {
            const updated = prev.map(t => t._id === tempId ? serverTask : t);
            console.log('Tasks after replacement:', updated.map(t => t._id));
            return updated;
          });
        } else {
          console.log('Invalid response structure:', serverTask);
          // Fallback: reload to get correct data
          loadGroupDetails();
        }
      })
      .catch(error => {
        // Rollback on failure
        console.error('Task creation failed:', error);
        setTasks(prev => prev.filter(t => t._id !== tempId));
        toast.error('Failed to create task');
      });
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    
    const pollData = {
      title: newPoll.question,
      options: newPoll.options.map(opt => opt),
      deadline: newPoll.deadline
    };

    // Create optimistic poll immediately
    const tempId = 'temp-' + Date.now();
    const optimisticPoll = {
      _id: tempId,
      title: pollData.title,
      options: pollData.options.map((opt, idx) => ({ text: opt, votes: [], _id: 'opt-' + idx })),
      deadline: pollData.deadline,
      group: groupId,
      createdAt: new Date().toISOString(),
      isOptimistic: true
    };

    // Immediately add to UI
    setPolls(prev => [optimisticPoll, ...prev]);
    setShowNewPollModal(false);
    setNewPoll({
      question: '',
      options: ['', ''],
      deadline: ''
    });
    toast.success('Poll created successfully');

    // API call runs silently in background
    try {
      const response = await GroupService.addPoll(groupId, pollData);
      // Replace optimistic poll with real poll from server (no full reload)
      // Backend returns data: savedPoll (not data.poll)
      if (response.data && response.data.data) {
        setPolls(prev => prev.map(p => p._id === tempId ? response.data.data : p));
      } else if (response.data) {
        setPolls(prev => prev.map(p => p._id === tempId ? response.data : p));
      }
    } catch (err) {
      // Rollback on failure
      setPolls(prev => prev.filter(p => p._id !== tempId));
      toast.error(err.message || 'Failed to create poll');
    }
  };

  const addPollOption = () => {
    setNewPoll(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removePollOption = (index) => {
    if (newPoll.options.length > 2) {
      setNewPoll(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const handleTaskCompletion = async (taskId) => {
    // If task still has temp ID, refresh to get real data then retry
    if (taskId.toString().startsWith('temp-')) {
      toast.info('Syncing task data...');
      await loadGroupDetails();
      return;
    }

    // Find current task to check if it's already completed by the user
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    const isCurrentlyCompleted = task.usersCompleted?.some(uid =>
      uid === user.id || (uid._id && uid._id === user.id)
    );

    // Optimistically update the UI
    setTasks(prev => prev.map(t => {
      if (t._id !== taskId) return t;
      
      let newUsersCompleted = [...(t.usersCompleted || [])];
      
      if (isCurrentlyCompleted) {
        // Remove user from completed list
        newUsersCompleted = newUsersCompleted.filter(uid => 
          uid !== user.id && uid._id !== user.id
        );
      } else {
        // Add user to completed list
        newUsersCompleted.push(user.id);
      }
      
      return { ...t, usersCompleted: newUsersCompleted };
    }));

    toast.success(`Task ${isCurrentlyCompleted ? 'marked as incomplete' : 'completed'} successfully`);

    // Determine the action based on current completion status
    const action = isCurrentlyCompleted ? 'uncomplete' : 'complete';

    // API call runs silently in background
    try {
      await GroupService.taskActions(groupId, taskId, action);
    } catch (error) {
      // Rollback on failure - reload to get correct state
      toast.error('Failed to update task status');
      loadGroupDetails();
    }
  };

  const handleVote = async (pollId, optionId) => {
    // Prevent voting on optimistic polls (not yet saved to server)
    if (pollId.toString().startsWith('temp-')) {
      toast.info('Please wait, poll is being created...');
      return;
    }

    // Find the poll and check if user already voted
    const poll = polls.find(p => p._id === pollId);
    if (!poll) return;

    // Check if user already voted on this option
    const alreadyVotedThisOption = poll.options.find(o => o._id === optionId)?.votes?.some(
      v => v === user.id || v._id === user.id
    );

    // Optimistically update the UI
    setPolls(prev => prev.map(p => {
      if (p._id !== pollId) return p;
      
      return {
        ...p,
        options: p.options.map(opt => {
          // Remove user's vote from all options first
          let newVotes = (opt.votes || []).filter(v => 
            v !== user.id && v._id !== user.id
          );
          
          // Add vote to the selected option (if not already voted on it)
          if (opt._id === optionId && !alreadyVotedThisOption) {
            newVotes = [...newVotes, user.id];
          }
          
          return { ...opt, votes: newVotes };
        })
      };
    }));

    toast.success('Vote recorded successfully');

    // API call runs silently in background
    try {
      await GroupService.votePoll(groupId, pollId, optionId);
    } catch (error) {
      // Rollback on failure - reload to get correct state
      toast.error('Failed to record vote');
      console.error(error);
      loadGroupDetails();
    }
  };

  const handleAddBuiltInTask = (task) => {
    setSelectedBuiltInTask(task);
  };

  const submitBuiltInTask = () => {
    if (!builtInTaskDeadline) {
      toast.error('Please select a deadline');
      return;
    }

    // Create optimistic task immediately
    const tempId = 'temp-' + Date.now();
    const taskToAdd = { ...selectedBuiltInTask };
    const deadlineToAdd = builtInTaskDeadline;
    
    const optimisticTask = {
      _id: tempId,
      title: taskToAdd.title,
      description: taskToAdd.description,
      deadline: deadlineToAdd,
      group: groupId,
      completedBy: [],
      createdAt: new Date().toISOString(),
      isBuiltIn: true,
      isOptimistic: true
    };

    // Immediately add to UI and close modal
    setTasks(prev => [optimisticTask, ...prev]);
    toast.success('Built-in task added successfully!');
    setSelectedBuiltInTask(null);
    setBuiltInTaskDeadline('');
    setBuiltInTaskSearch('');
    setShowBuiltInTaskModal(false);

    // API call runs silently in background
    GroupService.addTask(groupId, { 
      ...taskToAdd, 
      deadline: deadlineToAdd,
      isBuiltIn: true 
    })
      .then(serverTask => {
        // Replace optimistic task with real task (no full reload)
        console.log('Built-in Task API response:', serverTask);
        if (serverTask && serverTask._id) {
          console.log('Replacing temp task', tempId, 'with real task', serverTask._id);
          setTasks(prev => {
            const updated = prev.map(t => t._id === tempId ? serverTask : t);
            console.log('Tasks after replacement:', updated.map(t => t._id));
            return updated;
          });
        } else {
          console.log('Invalid response structure:', serverTask);
          loadGroupDetails();
        }
      })
      .catch(error => {
        // Rollback on failure
        console.error('Built-in task creation failed:', error);
        setTasks(prev => prev.filter(t => t._id !== tempId));
        toast.error('Failed to add built-in task: ' + (error.message || 'Server error'));
      });
  };

  const loadUserContacts = async () => {
    try {
      const response = await ContactService.getContacts();
      if (response.data) {
        // Filter out contacts that are already members
        const existingMemberIds = group?.members?.map(member => member._id) || [];
        const availableContacts = response.data.filter(
          contact => !existingMemberIds.includes(contact._id) && contact.approved
        );
        setUserContacts(availableContacts);

        if (availableContacts.length === 0) {
          toast.info('No contacts available to add. Add some contacts first!');
        }
      } else {
        toast.error(response.message || 'Failed to load contacts');
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error(error.response?.data?.message || 'Failed to load contacts');
    }
  };

  const handleMemberSelect = (contact) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m._id === contact._id);
      if (isSelected) {
        return prev.filter(m => m._id !== contact._id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleAddGroupMembers = async (e) => {
    if (e) e.preventDefault();

    // Validate input
    if (selectedMembers.length === 0) {
      toast.warning('Please select at least one contact to add');
      return;
    }

    // Store previous state for rollback
    const previousGroup = { ...group };
    const membersToAdd = [...selectedMembers];

    // Optimistic update - add members to UI immediately
    setGroup(prev => ({
      ...prev,
      members: [...prev.members, ...membersToAdd]
    }));

    // Close modal and reset selection immediately
    setShowAddMembersModal(false);
    setSelectedMembers([]);
    toast.success('Members added successfully');

    // Call API silently in background
    try {
      const response = await GroupService.groupActions(
        groupId,
        'addMembers',
        { members: membersToAdd.map(member => member._id) }
      );

      if (!response || response.error !== null) {
        // Rollback on failure
        setGroup(previousGroup);
        toast.error(response?.message || 'Failed to add members');
      }
    } catch (error) {
      console.error('Error adding members:', error);
      // Rollback on error
      setGroup(previousGroup);
      toast.error(error.message || 'Failed to add members');
    }
  };

  useEffect(() => {
    if (showAddMembersModal) {
      loadUserContacts();
    }
  }, [showAddMembersModal]);

  const viewTaskMembers = (task) => {
    setSelectedTask(task);
    setShowTaskMembersModal(true);
  };

  const calculateProgress = (task) => {
    if (!task || !task.usersCompleted || !group || !group.members) return 0;

    const completedCount = task.usersCompleted.length;
    const totalMembers = group.members.length;

    if (totalMembers === 0) return 0;
    return (completedCount / totalMembers) * 100;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    // Store task for potential rollback
    const taskToDelete = tasks.find(t => t._id === taskId);
    
    // Immediately remove from UI
    setTasks(prev => prev.filter(t => t._id !== taskId));
    toast.success('Task deleted successfully');

    // If it's an optimistic task (temp ID), no need to call API
    if (taskId.toString().startsWith('temp-')) {
      return;
    }

    // API call runs silently in background for real tasks
    try {
      await GroupService.deleteTask(groupId, taskId);
    } catch (error) {
      // Rollback on failure
      if (taskToDelete) {
        setTasks(prev => [...prev, taskToDelete]);
      }
      toast.error('Failed to delete task');
      console.error(error);
    }
  };

 const handleDeletePoll = async (pollId) => {
  if (!window.confirm('Are you sure you want to delete this poll?')) {
    return;
  }

  // Store poll for potential rollback
  const pollToDelete = polls.find(p => p._id === pollId);
  
  // Immediately remove from UI
  setPolls(prev => prev.filter(p => p._id !== pollId));
  toast.success('Poll deleted successfully');

  // If it's an optimistic poll (temp ID), no need to call API
  if (pollId.toString().startsWith('temp-')) {
    return;
  }

  // API call runs silently in background for real polls
  try {
    await GroupService.deletePoll(groupId, pollId);
  } catch (error) {
    // Rollback on failure
    if (pollToDelete) {
      setPolls(prev => [...prev, pollToDelete]);
    }
    toast.error('Failed to delete poll');
    console.error(error);
  }
};

  const userVoted = (poll) => {
    if (!poll || !poll.options || !user || !user.id) return false;

    // Check if the user has voted on any option in this poll
    return poll.options.some(option =>
      option.votes && option.votes.some(vote =>
        vote === user.id || (vote._id && vote._id === user.id)
      )
    );
  };

  const calculateVotePercentage = (poll, option) => {
    if (!poll || !poll.options || !option || !option.votes) return 0;

    // Calculate total votes across all options
    const totalVotes = poll.options.reduce((sum, opt) =>
      sum + (opt.votes ? opt.votes.length : 0), 0);

    if (totalVotes === 0) return 0;

    // Calculate percentage for this option
    return (option.votes.length / totalVotes) * 100;
  };

  const pollHasUserVote = (poll) => {
    if (!user || !poll || !poll.options) return false;

    const userId = user.id;
    return poll.options.some(option =>
      option.votes && option.votes.some(vote =>
        vote === userId || (vote._id && vote._id === userId)
      )
    );
  };

  const openPollVotesModal = (poll) => {
    setSelectedPoll(poll);
    setShowPollVotesModal(true);
  };

  // Create a standardized action button component for both tasks and polls
  const ActionButton = ({ icon, label, onClick, variant = 'primary' }) => (
    <button
      className={`action-btn ${variant}`}
      onClick={onClick}
      title={label}
    >
      <i className={`fas ${icon}`}></i>
      {label && <span>{label}</span>}
    </button>
  );

  // Add this function near your other helper functions
  const isTaskCompleted = (task) => {
    if (!user || !task || !task.usersCompleted) return false;

    const userId = user.id;
    return task.usersCompleted.some(completedUser =>
      completedUser === userId ||
      (completedUser._id && completedUser._id === userId)
    );
  };

  // Separate handlers for each type of task
  const openAddTaskModal = () => {
    console.log('Opening custom task modal');
    setShowAddTaskModal(true);
    setShowBuiltInTaskModal(false); // Ensure the other modal is closed
  };

  const openBuiltInTaskModal = () => {
    console.log('Opening built-in task modal');
    setShowBuiltInTaskModal(true);
    setShowAddTaskModal(false); // Ensure the other modal is closed
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member from the group?')) {
      return;
    }

    // Store previous state for rollback
    const previousGroup = { ...group };
    const previousMembers = [...group.members];

    // Optimistic update - remove member from UI immediately
    setGroup(prev => ({
      ...prev,
      members: prev.members.filter(member => member._id !== memberId)
    }));
    toast.success('Member removed successfully');

    // Call API silently in background
    try {
      const updatedMemberIds = previousMembers
        .filter(member => member._id !== memberId)
        .map(member => member._id);

      const response = await GroupService.updateGroupDetails(groupId, {
        members: updatedMemberIds
      });

      if (!response.data) {
        // Rollback on failure
        setGroup(previousGroup);
        toast.error(response.message || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Error removing member:', error);
      // Rollback on error
      setGroup(previousGroup);
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  };

  // ============== OWNERSHIP HELPER FUNCTIONS ==============

  // Check if current user is the super owner (original creator)
  const isSuperOwner = () => {
    return group?.owner === user?.id;
  };

  // Check if current user is any type of owner (super or additional)
  const isOwner = () => {
    if (!group || !user) return false;
    return group.owner === user.id || 
           (group.owners && group.owners.some(o => o._id === user.id));
  };

  // Check if a member is the super owner
  const isMemberSuperOwner = (memberId) => {
    return group?.owner === memberId;
  };

  // Check if a member is an additional owner
  const isMemberOwner = (memberId) => {
    return group?.owners && group.owners.some(o => o._id === memberId);
  };

  // Add owner (optimistic update)
  const handleAddOwner = async (memberId) => {
    if (!window.confirm('Are you sure you want to make this member a group owner?')) {
      return;
    }

    // Find the member to add as owner
    const memberToPromote = group.members.find(m => m._id === memberId);
    if (!memberToPromote) return;

    // Optimistically update UI
    const previousOwners = group.owners || [];
    setGroup(prev => ({
      ...prev,
      owners: [...(prev.owners || []), memberToPromote]
    }));
    toast.success('Owner added successfully');

    // Call API silently in background
    try {
      const response = await GroupService.addOwner(groupId, memberId);
      if (!response.data) {
        // Rollback on failure
        setGroup(prev => ({
          ...prev,
          owners: previousOwners
        }));
        toast.error(response.message || 'Failed to add owner');
      }
    } catch (error) {
      // Rollback on error
      setGroup(prev => ({
        ...prev,
        owners: previousOwners
      }));
      console.error('Error adding owner:', error);
      toast.error(error.error || error.message || 'Failed to add owner');
    }
  };

  // Remove owner (optimistic update - demote to regular member)
  const handleRemoveOwner = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member from ownership?')) {
      return;
    }

    // Optimistically update UI
    const previousOwners = group.owners || [];
    setGroup(prev => ({
      ...prev,
      owners: (prev.owners || []).filter(o => o._id !== memberId)
    }));
    toast.success('Owner removed successfully');

    // Call API silently in background
    try {
      const response = await GroupService.removeOwner(groupId, memberId);
      if (!response.data) {
        // Rollback on failure
        setGroup(prev => ({
          ...prev,
          owners: previousOwners
        }));
        toast.error(response.message || 'Failed to remove owner');
      }
    } catch (error) {
      // Rollback on error
      setGroup(prev => ({
        ...prev,
        owners: previousOwners
      }));
      console.error('Error removing owner:', error);
      toast.error(error.error || error.message || 'Failed to remove owner');
    }
  };

  // Complete rewrite of the handleSearchChange function
  const handleSearchChange = (e) => {
    // Safeguard input value
    if (!e || !e.target) {
      console.error('Invalid event object in handleSearchChange');
      return;
    }

    const searchText = String(e.target.value || '').toLowerCase();
    setSearchTerm(searchText);

    // Safeguard userContacts
    if (!Array.isArray(userContacts)) {
      console.error('userContacts is not an array:', userContacts);
      setFilteredContacts([]);
      return;
    }

    if (searchText.trim() === '') {
      setFilteredContacts(userContacts);
      return;
    }

    // Create a safe version of the filter function
    const safeFilteredContacts = userContacts.filter(contact => {
      if (!contact) return false;

      // Safe string properties access
      const safeToString = (val) => {
        if (val === null || val === undefined) return '';
        return String(val).toLowerCase();
      };

      const username = safeToString(contact.username);
      const email = safeToString(contact.email);
      const firstName = safeToString(contact.firstName);
      const lastName = safeToString(contact.lastName);

      return username.includes(searchText) ||
        email.includes(searchText) ||
        firstName.includes(searchText) ||
        lastName.includes(searchText);
    });

    setFilteredContacts(safeFilteredContacts);
  };

  // ============== USER TASK LIST FUNCTIONS ==============

  // Load user's personal task list
  const loadUserTaskList = async () => {
    try {
      setUserTaskListLoading(true);
      const response = await GroupService.getUserTaskList();
      if (response.data) {
        setUserTaskList(response.data);
      }
    } catch (error) {
      console.error('Error loading user task list:', error);
      toast.error('Failed to load your task list');
    } finally {
      setUserTaskListLoading(false);
    }
  };

  // Add task to user's personal list (from created task or built-in)
  const handleAddToUserTaskList = async (task) => {
    const taskData = {
      title: task.title,
      description: task.description || '',
      category: task.category || 'Custom',
      isBuiltIn: task.isBuiltIn || false,
      builtInTaskId: task.id || null
    };
    
    // Optimistic update - add temp task immediately
    const tempId = 'temp-' + Date.now();
    const optimisticTask = {
      _id: tempId,
      ...taskData,
      createdAt: new Date().toISOString()
    };
    
    setUserTaskList(prev => [optimisticTask, ...prev]);
    toast.success('Task added to your personal list!');
    
    // API call in background
    GroupService.addToUserTaskList(taskData)
      .then(response => {
        // Replace temp task with real one
        if (response.data) {
          setUserTaskList(prev => prev.map(t => t._id === tempId ? response.data : t));
        }
      })
      .catch(error => {
        // Rollback on error
        setUserTaskList(prev => prev.filter(t => t._id !== tempId));
        if (error.error === 'Duplicate task') {
          toast.info('This task is already in your list');
        } else {
          toast.error('Failed to add task to your list');
        }
      });
  };

  // Remove task from user's personal list
  const handleRemoveFromUserTaskList = (taskId) => {
    // Optimistic update - remove immediately
    const removedTask = userTaskList.find(t => t._id === taskId);
    setUserTaskList(prev => prev.filter(t => t._id !== taskId));
    toast.success('Task removed from your list');
    
    // API call in background
    GroupService.removeFromUserTaskList(taskId)
      .catch(() => {
        // Rollback on error - add the task back
        if (removedTask) {
          setUserTaskList(prev => [...prev, removedTask]);
        }
        toast.error('Failed to remove task from your list');
      });
  };

  // Open user task list modal
  const openUserTaskListModal = () => {
    setShowUserTaskListModal(true);
    loadUserTaskList();
  };

  // Use task from user's list to create a group task
  const handleUseTaskFromList = (task) => {
    setSelectedBuiltInTask({
      id: task._id,
      title: task.title,
      description: task.description,
      category: task.category,
      isBuiltIn: task.isBuiltIn
    });
    setShowUserTaskListModal(false);
    setShowBuiltInTaskModal(true);
  };

  if (!user || !user.id) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mb-4"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }


  const isDuplicateOption = (options, newValue, currentIndex) => {
    return options.some((option, index) => 
      index !== currentIndex && 
      option.toLowerCase().trim() === newValue.toLowerCase().trim()
    );
  };



  return (
    <div className="min-h-screen bg-primary-600">
      <Navbar />
      <div className="pt-16 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : group ? (
          <div className="py-8 flex gap-8">
            {/* Left Sidebar */}
            <div className="w-80 flex-shrink-0 space-y-8">
              {/* Group Info Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border-2 border-primary-100">
                <div className="space-y-4">
                  <h1 className="text-2xl font-extrabold text-gray-900">{group.name}</h1>
                  {group.description && (
                    <p className="text-gray-700 text-sm font-medium">{group.description}</p>
                  )}
                </div>
              </div>

              {/* Members List Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border-2 border-primary-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Members</h2>
                  {group && user && isOwner() && (
                    <button
                      onClick={() => setShowAddMembersModal(true)}
                      className="text-primary-600 hover:bg-primary-50 p-2.5 rounded-lg text-sm font-bold border-2 border-primary-200 hover:border-primary-300"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {group.members?.map(member => (
                    <div key={member._id} className="flex items-center space-x-3 p-3 hover:bg-primary-50 rounded-lg border border-primary-100 hover:border-primary-200 transition duration-150">
                      <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {getInitials(member.firstName || member.username)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900">
                          {member.firstName ? `${member.firstName} ${member.lastName || ''}` : member.username}
                        </div>
                        {/* Show role badge */}
                        {isMemberSuperOwner(member._id) ? (
                          <div className="text-xs font-bold text-primary-600">
                            <i className="fas fa-crown mr-1"></i>Owner
                          </div>
                        ) : isMemberOwner(member._id) ? (
                          <div className="text-xs font-bold text-indigo-600">
                            <i className="fas fa-user-shield mr-1"></i>Co-Owner
                          </div>
                        ) : null}
                      </div>
                      
                      {/* Action buttons for owners */}
                      {isOwner() && member._id !== user.id && !isMemberSuperOwner(member._id) && (
                        <div className="flex items-center gap-1">
                          {/* Toggle ownership button */}
                          {isMemberOwner(member._id) ? (
                            <button
                              onClick={() => handleRemoveOwner(member._id)}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition"
                              title="Remove from ownership"
                            >
                              <i className="fas fa-user-minus text-xs"></i>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAddOwner(member._id)}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition"
                              title="Make owner"
                            >
                              <i className="fas fa-user-shield text-xs"></i>
                            </button>
                          )}
                          {/* Remove member button */}
                          <button
                            onClick={() => handleRemoveMember(member._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                            title="Remove from group"
                          >
                            <i className="fas fa-times text-xs"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Tabs Container */}
              <div className="bg-white rounded-xl shadow-md border-2 border-primary-100">
                {/* Tab Headers */}
                <div className="flex border-b border-primary-100">
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`flex-1 py-4 text-center font-bold text-sm transition-colors duration-150 ${activeTab === 'tasks'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-primary-600'
                      }`}
                  >
                    Tasks
                  </button>
                  <button
                    onClick={() => setActiveTab('polls')}
                    className={`flex-1 py-4 text-center font-bold text-sm transition-colors duration-150 ${activeTab === 'polls'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-primary-600'
                      }`}
                  >
                    Polls
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-4 text-center font-bold text-sm transition-colors duration-150 ${activeTab === 'chat'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-primary-600'
                      }`}
                  >
                    Chat
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'tasks' ? (
                    <div className="space-y-6">
                      {/* Task Actions - VISIBLE TO ALL OWNERS */}
                      {user && group && isOwner() && (
                        <div className="flex flex-wrap gap-4 mb-6">
                          <button
                            onClick={() => setShowAddTaskModal(true)}
                            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 text-sm font-medium shadow-sm"
                          >
                            <i className="fas fa-plus mr-2"></i> Create Task
                          </button>
                          <button
                            onClick={() => setShowBuiltInTaskModal(true)}
                            className="flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition duration-150 text-sm font-medium shadow-sm border border-primary-200"
                          >
                            <i className="fas fa-tasks mr-2"></i> Add Built-in Tasks
                          </button>
                          <button
                            onClick={openUserTaskListModal}
                            className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition duration-150 text-sm font-medium shadow-sm border border-green-200"
                          >
                            <i className="fas fa-bookmark mr-2"></i> My Task List
                          </button>
                        </div>
                      )}

                      {/* Progress Button - Visible to all members */}
                      <div className="flex flex-wrap gap-4 mb-6">
                        <button
                          onClick={() => navigate(`/progress-history/${groupId}`)}
                          className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition duration-150 text-sm font-medium shadow-sm border border-indigo-200"
                        >
                          <i className="fas fa-chart-line mr-2"></i> View My Progress
                        </button>
                      </div>

                      {/* Task Search Bar */}
                      <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fas fa-search text-gray-400"></i>
                        </div>
                        <input
                          type="text"
                          placeholder="Search tasks by name..."
                          value={taskTabSearch}
                          onChange={(e) => setTaskTabSearch(e.target.value)}
                          className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white text-sm transition-all duration-200 shadow-sm"
                        />
                        {taskTabSearch && (
                          <button
                            onClick={() => setTaskTabSearch('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            <i className="fas fa-times-circle"></i>
                          </button>
                        )}
                      </div>

                      {/* Tasks List */}
                      <div className="space-y-4">
                        {(() => {
                          // Filter out expired tasks and apply search
                          const activeTasks = tasks
                            .filter(task => new Date(task.deadline) > new Date())
                            .filter(task => task.title.toLowerCase().includes(taskTabSearch.toLowerCase()));
                          
                          if (activeTasks.length === 0) {
                            return (
                              <div className="text-center py-8">
                                <p className="text-gray-500">No active tasks available.</p>
                                {user && group && isOwner() && (
                                  <button
                                    onClick={() => setShowAddTaskModal(true)}
                                    className="mt-4 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition duration-150 text-sm font-medium"
                                  >
                                    <i className="fas fa-plus mr-2"></i> Add New Task
                                  </button>
                                )}
                              </div>
                            );
                          }
                          
                          return (
                            <TasksList
                              tasks={activeTasks}
                              group={group}
                              user={user || {}}
                              onTaskComplete={handleTaskCompletion}
                              onTaskDelete={handleDeleteTask}
                              onViewProgress={viewTaskMembers}
                              calculateProgress={calculateProgress}
                              isOwner={isOwner()}
                            />
                          );
                        })()}
                      </div>
                    </div>
                  ) : activeTab === 'polls' ? (
                    <div className="space-y-6">
                      {/* Poll Actions - VISIBLE TO ALL OWNERS */}
                      {user && group && isOwner() && (
                        <div className="flex flex-wrap gap-4 mb-6">
                          <button
                            onClick={() => setShowNewPollModal(true)}
                            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 text-sm font-medium shadow-sm"
                          >
                            <i className="fas fa-plus mr-2"></i> Create Poll
                          </button>
                        </div>
                      )}

                      {/* Poll Search Bar */}
                      <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fas fa-search text-gray-400"></i>
                        </div>
                        <input
                          type="text"
                          placeholder="Search polls by name..."
                          value={pollTabSearch}
                          onChange={(e) => setPollTabSearch(e.target.value)}
                          className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white text-sm transition-all duration-200 shadow-sm"
                        />
                        {pollTabSearch && (
                          <button
                            onClick={() => setPollTabSearch('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            <i className="fas fa-times-circle"></i>
                          </button>
                        )}
                      </div>

                      {/* Polls List */}
                      <div className="space-y-4">
                        {(() => {
                          // Filter out expired polls and apply search
                          const activePolls = polls
                            .filter(poll => new Date(poll.deadline) > new Date())
                            .filter(poll => poll.title.toLowerCase().includes(pollTabSearch.toLowerCase()));
                          
                          if (activePolls.length === 0) {
                            return (
                              <div className="text-center py-8">
                                <p className="text-gray-500">No active polls available.</p>
                                {user && group && isOwner() && (
                                  <button
                                    onClick={() => setShowNewPollModal(true)}
                                    className="mt-4 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition duration-150 text-sm font-medium"
                                  >
                                    <i className="fas fa-plus mr-2"></i> Create New Poll
                                  </button>
                                )}
                              </div>
                            );
                          }
                          
                          return (
                            <PollsList
                              polls={activePolls}
                              user={user || {}}
                              onVote={handleVote}
                              onDelete={handleDeletePoll}
                              onViewResults={openPollVotesModal}
                              group={group}
                              userVoted={userVoted}
                              isOwner={isOwner()}
                            />
                          );
                        })()}
                      </div>
                    </div>
                  ) : (
                    <GroupChat
  apiKey={"szew68z5xj78"}
  userId={user.id}
  userName={user.firstName || user.username || user.email}
  groupId={groupId}
  groupName={group.name}
  memberIds={group.members.map(member => member._id)}
/>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <p className="text-red-600 font-bold">Failed to load group details</p>
          </div>
        )}
      </div>

      {/* Add Members Modal */}
      {showAddMembersModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-[90%] max-w-[600px] mb-32 shadow-lg border-2 border-primary-100">
            <div className="p-8">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add Members</h2>
                <button
                  onClick={() => {
                    setShowAddMembersModal(false);
                    setSelectedMembers([]);
                  }}
                  className="text-gray-400 hover:text-gray-500 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {userContacts.length > 0 ? (
                  <div className="space-y-3">
                    {userContacts.map(contact => (
                      <div
                        key={contact._id}
                        className="flex items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition duration-150"
                      >
                        <label className="flex items-center space-x-3 w-full cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedMembers.some(m => m._id === contact._id)}
                            onChange={() => handleMemberSelect(contact)}
                            className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500"
                          />
                          <div>
                            <div className="font-bold text-gray-900">{contact.username}</div>
                            <div className="text-sm text-gray-500">{contact.email}</div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No contacts available to add
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => {
                    setShowAddMembersModal(false);
                    setSelectedMembers([]);
                  }}
                  className="px-6 py-2.5 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition duration-150 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGroupMembers}
                  disabled={selectedMembers.length === 0}
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 text-sm font-medium"
                >
                  Add Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-[90%] max-w-[600px] mb-32 shadow-lg border-2 border-primary-100">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">
                Create New Task
              </h2>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateTask(newTask);
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    min={new Date(new Date().setHours(0,0,0,0)).toISOString().slice(0, 16)}
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
                    required
                  />
                </div>

                {/* Save to My Task List Option */}
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <input
                    type="checkbox"
                    id="saveToList"
                    checked={newTask.saveToList || false}
                    onChange={(e) => setNewTask({ ...newTask, saveToList: e.target.checked })}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="saveToList" className="text-sm text-green-700 cursor-pointer">
                    <i className="fas fa-bookmark mr-2"></i>
                    Save to My Task List for future use
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddTaskModal(false)}
                    className="px-6 py-2.5 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition duration-150 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 text-sm font-medium"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

     {/* Built-in Task Modal */}
{showBuiltInTaskModal && (
  <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50 overflow-y-auto">
    <div className="bg-white rounded-xl w-[90%] max-w-[600px] mb-32 shadow-lg border-2 border-primary-100">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">
          {selectedBuiltInTask && !builtInTasks.find(t => t.id === selectedBuiltInTask.id) 
            ? 'Add Task from My List' 
            : 'Add Built-in Task'}
        </h2>

        {/* Show selected task from user's list (not in builtInTasks) */}
        {selectedBuiltInTask && !builtInTasks.find(t => t.id === selectedBuiltInTask.id) && (
          <div className="mb-6 p-4 border-2 border-green-500 bg-green-50 rounded-lg">
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900">{selectedBuiltInTask.title}</h3>
                  <span className="px-2 py-0.5 bg-green-200 text-green-800 text-xs rounded-full">From My List</span>
                </div>
                <p className="text-sm text-gray-600">{selectedBuiltInTask.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="datetime-local"
                  min={(() => { const now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); return now.toISOString().slice(0, 16); })()}
                  value={builtInTaskDeadline}
                  onChange={(e) => setBuiltInTaskDeadline(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (!builtInTaskDeadline) {
                      toast.error('Please set a deadline');
                      return;
                    }
                    submitBuiltInTask();
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                >
                  Add Task
                </button>
                <button
                  onClick={() => {
                    setSelectedBuiltInTask(null);
                    setBuiltInTaskDeadline('');
                  }}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Only show built-in tasks list if NO task from user's list is selected */}
        {!(selectedBuiltInTask && !builtInTasks.find(t => t.id === selectedBuiltInTask.id)) && (
        <>
        {/* Built-in Task Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fas fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            placeholder="Search built-in tasks..."
            value={builtInTaskSearch}
            onChange={(e) => setBuiltInTaskSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white text-sm transition-all duration-200 shadow-sm"
          />
          {builtInTaskSearch && (
            <button
              onClick={() => setBuiltInTaskSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times-circle"></i>
            </button>
          )}
        </div>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {builtInTasks
            .filter(task => task.title.toLowerCase().includes(builtInTaskSearch.toLowerCase()))
            .map(task => (
            <div
              key={task.id}
              className={`p-4 border-2 ${
                selectedBuiltInTask?.id === task.id 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
              } rounded-lg transition duration-150`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>
                {selectedBuiltInTask?.id === task.id ? (
                  <div className="ml-4 flex items-center space-x-2">
                    <input
                      type="datetime-local"
                      min={(() => { const now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); return now.toISOString().slice(0, 16); })()}
                      value={builtInTaskDeadline}
                      onChange={(e) => {
                        setBuiltInTaskDeadline(e.target.value);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      required
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (!builtInTaskDeadline) {
                          toast.error('Please set a deadline');
                          return;
                        }
                        const deadlineDate = new Date(builtInTaskDeadline);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (deadlineDate < today) {
                          toast.error('Cannot set deadline in the past');
                          return;
                        }
                        submitBuiltInTask();
                      }}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                    >
                      Add Task
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToUserTaskList(selectedBuiltInTask);
                      }}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                      title="Save to My Task List"
                    >
                      <i className="fas fa-bookmark"></i>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddBuiltInTask(task)}
                    className="px-4 py-2 text-primary-600 hover:bg-primary-100 rounded-lg text-sm font-medium"
                  >
                    Select
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        </>
        )}

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
          <button
            onClick={() => {
              setShowBuiltInTaskModal(false);
              setSelectedBuiltInTask(null);
              setBuiltInTaskDeadline('');
              setBuiltInTaskSearch('');
            }}
            className="px-6 py-2.5 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition duration-150 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      {/* Create Poll Modal */}
      {showNewPollModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-[90%] max-w-[600px] mb-32 shadow-lg border-2 border-primary-100">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">
                Create New Poll
              </h2>

              <form onSubmit={(e) => {
                e.preventDefault();
                // Validate deadline
                const deadlineDate = new Date(newPoll.deadline);
                const now = new Date();
                if (deadlineDate < now) {
                  toast.error('Cannot set deadline in the past');
                  return;
                }
                handleCreatePoll(e);
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Question
                  </label>
                  <input
                    type="text"
                    value={newPoll.question}
                    onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
                    required
                  />
                </div>


                



 {/* Update the options input handling */}
<div className="space-y-3">
  <label className="block text-sm font-bold text-gray-700 mb-2">
    Options
  </label>
  {newPoll.options.map((option, index) => (
    <div key={index} className="flex gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={option}
          onChange={(e) => {
            const newValue = e.target.value;
            if (isDuplicateOption(newPoll.options, newValue, index)) {
              toast.error('This option already exists');
              return;
            }
            const newOptions = [...newPoll.options];
            newOptions[index] = newValue;
            setNewPoll({ ...newPoll, options: newOptions });
          }}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
          placeholder={`Option ${index + 1}`}
          required
        />
      </div>
      {index > 1 && (
        <button
          type="button"
          onClick={() => removePollOption(index)}
          className="p-2 text-gray-400 hover:text-gray-500"
        >
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  ))}
  <button
    type="button"
    onClick={addPollOption}
    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
  >
    + Add Option
  </button>
</div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    min={(() => {
                      const now = new Date();
                      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                      return now.toISOString().slice(0, 16);
                    })()}
                    value={newPoll.deadline}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const now = new Date();
                      if (selectedDate < now) {
                        toast.error('Cannot set deadline in the past');
                        return;
                      }
                      setNewPoll({ ...newPoll, deadline: e.target.value });
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
                    required
                  />
                </div>


                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowNewPollModal(false)}
                    className="px-6 py-2.5 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition duration-150 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 text-sm font-medium"
                  >
                    Create Poll
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Task Progress Modal */}
      {showTaskMembersModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-[90%] max-w-[600px] mb-32 shadow-lg border-2 border-primary-100">
            <div className="p-8">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Task Progress</h2>
                <button
                  onClick={() => setShowTaskMembersModal(false)}
                  className="text-gray-400 hover:text-gray-500 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 text-lg mb-2">{selectedTask.title}</h3>
                <p className="text-gray-600 mb-3">{selectedTask.description}</p>

                {/* Deadline */}
                <div className="flex items-center text-sm font-medium mb-4">
                  <i className="far fa-clock text-primary-600 mr-2"></i>
                  <span className={`${new Date(selectedTask.deadline) < new Date() ? 'text-red-600' : 'text-gray-600'
                    }`}>
                    Deadline: {new Date(selectedTask.deadline).toLocaleString()}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="relative h-3 bg-primary-100 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-primary-600 transition-all duration-300"
                      style={{ width: `${calculateProgress(selectedTask)}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-sm font-bold text-primary-600 text-right">
                    {selectedTask.usersCompleted?.length || 0} of {group.members?.length || 0} completed
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-900">Member Status</h3>

                {/* Members List - Only shows visible members */}
                <div className="max-h-[300px] overflow-y-auto space-y-3">
                  {group.members
                    .filter(member =>
                      !selectedTask.hiddenMembers?.includes(member._id) &&
                      !group.hiddenMembers?.includes(member._id)
                    )
                    .map(member => {
                      const hasCompleted = selectedTask.usersCompleted?.some(
                        userId => userId === member._id || (userId._id && userId._id === member._id)
                      );

                      return (
                        <div
                          key={member._id}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary-200 transition duration-150"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                              {getInitials(member.firstName || member.username)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">
                                {member.firstName ? `${member.firstName} ${member.lastName || ''}` : member.username}
                                {member._id === user.id && " (You)"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {hasCompleted ? 'Completed' : 'Not completed'}
                              </div>
                            </div>
                          </div>

                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${hasCompleted
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {hasCompleted ? '✓ Done' : 'Pending'}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setShowTaskMembersModal(false)}
                  className="px-6 py-2.5 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition duration-150 text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Poll Results Modal */}
      {showPollVotesModal && selectedPoll && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-[90%] max-w-[600px] mb-32 shadow-lg border-2 border-primary-100">
            <div className="p-8">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Poll Votes</h2>
                <button
                  onClick={() => setShowPollVotesModal(false)}
                  className="text-gray-400 hover:text-gray-500 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 text-lg mb-2">{selectedPoll.title}</h3>

                {/* Deadline */}
                <div className="flex items-center text-sm font-medium mb-4">
                  <i className="far fa-clock text-primary-600 mr-2"></i>
                  <span className={`${new Date(selectedPoll.deadline) < new Date() ? 'text-red-600' : 'text-gray-600'
                    }`}>
                    Deadline: {new Date(selectedPoll.deadline).toLocaleString()}
                    {new Date(selectedPoll.deadline) < new Date()}
                  </span>
                </div>

                {/* Overall Progress Bar */}
                <div className="mt-4">
                  <div className="relative h-3 bg-primary-100 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-primary-600 transition-all duration-300"
                      style={{
                        width: `${(selectedPoll.options.reduce((acc, opt) =>
                          acc + (opt.votes?.length || 0), 0) / group.members.length) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="mt-2 text-sm font-bold text-primary-600 text-right">
                    {selectedPoll.options.reduce((acc, opt) => acc + (opt.votes?.length || 0), 0)} of {group.members.length} voted
                  </div>
                </div>
              </div>

              {/* Options with Progress */}
              <div className="space-y-6 mb-8">
                {selectedPoll.options.map(option => {
                  const voteCount = option.votes?.length || 0;
                  const percentage = (voteCount / group.members.length) * 100;

                  return (
                    <div key={option._id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">{option.text}</span>
                        <span className="text-sm font-bold text-primary-600">
                          {voteCount} votes ({Math.round(percentage)}%)
                        </span>
                      </div>
                      <div className="relative h-2 bg-primary-100 rounded-full overflow-hidden">
                        <div
                          className="absolute h-full bg-primary-600 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-900">Member Votes</h3>

                {/* Members List */}
                <div className="max-h-[300px] overflow-y-auto space-y-3">
                  {group.members
                    .filter(member =>
                      !group.hiddenMembers?.includes(member._id)
                    )
                    .map(member => {
                      const memberVote = selectedPoll.options.find(option =>
                        option.votes?.some(vote =>
                          vote === member._id || (vote._id && vote._id === member._id)
                        )
                      );

                      return (
                        <div
                          key={member._id}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary-200 transition duration-150"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                              {getInitials(member.firstName || member.username)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">
                                {member.firstName ? `${member.firstName} ${member.lastName || ''}` : member.username}
                                {member._id === user.id && " (You)"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {memberVote ? memberVote.text : 'Not voted'}
                              </div>
                            </div>
                          </div>

                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${memberVote
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {memberVote ? 'Voted' : 'Pending'}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setShowPollVotesModal(false)}
                  className="px-6 py-2.5 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition duration-150 text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Task List Modal */}
      {showUserTaskListModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-[90%] max-w-[700px] mb-20 shadow-lg border-2 border-green-100">
            <div className="p-8">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  <i className="fas fa-bookmark text-green-600 mr-2"></i>
                  My Task List
                </h2>
                <p className="text-sm text-gray-500">Save tasks for quick reuse</p>
              </div>

              {userTaskListLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                </div>
              ) : userTaskList.length === 0 ? (
                <div className="text-center py-12">
                  <i className="fas fa-clipboard-list text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 mb-2">Your task list is empty</p>
                  <p className="text-sm text-gray-400">Save tasks from "Create Task" or "Built-in Tasks" to build your personal library</p>
                </div>
              ) : (
                <>
                {/* User Task List Search Bar */}
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="Search your tasks..."
                    value={userTaskListSearch}
                    onChange={(e) => setUserTaskListSearch(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white text-sm transition-all duration-200 shadow-sm"
                  />
                  {userTaskListSearch && (
                    <button
                      onClick={() => setUserTaskListSearch('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <i className="fas fa-times-circle"></i>
                    </button>
                  )}
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {userTaskList
                    .filter(task => task.title.toLowerCase().includes(userTaskListSearch.toLowerCase()))
                    .map(task => (
                    <div
                      key={task._id}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition duration-150"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900">{task.title}</h3>
                            {task.isBuiltIn && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                Built-in
                              </span>
                            )}
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {task.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleUseTaskFromList(task)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                            title="Use this task"
                          >
                            <i className="fas fa-plus mr-1"></i> Use
                          </button>
                          <button
                            onClick={() => handleRemoveFromUserTaskList(task._id)}
                            className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
                            title="Remove from list"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                </>
              )}

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => {
                    setShowUserTaskListModal(false);
                    setUserTaskListSearch('');
                  }}
                  className="px-6 py-2.5 border border-green-200 text-green-700 rounded-lg hover:bg-green-50 hover:border-green-300 transition duration-150 text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
