import React, { useState } from 'react';
import type { User } from '../types';
import { Gender } from '../types';

interface ProfileCreationProps {
  onProfileCreate: (user: Omit<User, 'id'>) => void;
}

const ProfileCreation: React.FC<ProfileCreationProps> = ({ onProfileCreate }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>(Gender.Female);
  const [occupation, setOccupation] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !occupation || !photo) {
      setError('Please fill out all fields and upload a photo.');
      return;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18) {
      setError('Please enter a valid age (18+).');
      return;
    }
    setError('');
    onProfileCreate({ name, age: ageNum, gender, occupation, photo });
  };

  return (
    <div className="p-6 h-full flex flex-col justify-center animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Your Profile</h2>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-center">
            <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 overflow-hidden border-2 border-dashed border-gray-300 hover:border-pink-400 transition-colors">
                    {photo ? (
                        <img src={photo} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
            </label>
            <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Jessica" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
          <input type="number" id="age" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 28" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select value={gender} onChange={e => setGender(e.target.value as Gender)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md">
            <option>{Gender.Female}</option>
            <option>{Gender.Male}</option>
          </select>
        </div>
        <div>
          <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Occupation / Study</label>
          <input type="text" id="occupation" value={occupation} onChange={e => setOccupation(e.target.value)} placeholder="e.g. Graphic Designer" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm" />
        </div>
        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-transform transform hover:scale-105">
          Start Matching
        </button>
      </form>
    </div>
  );
};

export default ProfileCreation;