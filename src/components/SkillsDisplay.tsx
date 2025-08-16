"use client"
// @ts-nocheck;
import { useState } from 'react';

interface SkillsDisplayProps {
  skills: string[];
  onSkillToggle?: (skill: string, isSelected: boolean) => void;
}

export default function SkillsDisplay({ skills, onSkillToggle }: SkillsDisplayProps) {
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set(skills));
  
  const toggleSkill = (skill: string) => {
    const newSelectedSkills = new Set(selectedSkills);
    
    if (newSelectedSkills.has(skill)) {
      newSelectedSkills.delete(skill);
    } else {
      newSelectedSkills.add(skill);
    }
    
    setSelectedSkills(newSelectedSkills);
    
    if (onSkillToggle) {
      onSkillToggle(skill, newSelectedSkills.has(skill));
    }
  };
  
  // Group skills by category (in a real app, this would be more sophisticated)
  const skillCategories = {
    'Blockchain': ['Blockchain', 'Smart Contracts', 'Solidity', 'Web3', 'Ethereum', 'DeFi', 'NFT', 'Cryptocurrency'],
    'Programming': ['JavaScript', 'Python', 'React', 'TypeScript', 'Node.js', 'Java', 'C#', 'C++', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'Golang', 'Rust'],
    'AI/ML': ['Machine Learning', 'AI', 'TensorFlow', 'PyTorch', 'Data Science', 'NLP', 'Computer Vision'],
    'Frontend': ['React', 'Angular', 'Vue', 'HTML', 'CSS', 'SCSS', 'Sass', 'TailwindCSS', 'Bootstrap'],
    'Backend': ['Node.js', 'Express', 'Django', 'Flask', 'Spring', 'ASP.NET', 'Laravel', 'Ruby on Rails', 'FastAPI'],
    'DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitHub Actions'],
    'Databases': ['SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'DynamoDB', 'Cassandra', 'Elasticsearch'],
    'Other': ['Product Management', 'Leadership', 'Communication', 'Agile', 'Scrum', 'Project Management', 'Team Management']
  };
  
  // Categorize skills - only include categories that have at least one matching skill
  const categorizedSkills: Record<string, string[]> = {};
  
  for (const category in skillCategories) {
    const matchingSkills = skills.filter(skill => 
      skillCategories[category as keyof typeof skillCategories].includes(skill)
    );
    
    // Only add the category if there are matching skills
    if (matchingSkills.length > 0) {
      categorizedSkills[category] = matchingSkills;
    }
  }
  
  // Add uncategorized skills to "Other"
  const allCategorizedSkills = Object.values(skillCategories).flat();
  const uncategorizedSkills = skills.filter(skill => !allCategorizedSkills.includes(skill));
  
  if (uncategorizedSkills.length > 0) {
    if (categorizedSkills['Other']) {
      categorizedSkills['Other'] = [...categorizedSkills['Other'], ...uncategorizedSkills];
    } else {
      categorizedSkills['Other'] = uncategorizedSkills;
    }
  }
  
  // Remove empty categories
  Object.keys(categorizedSkills).forEach(category => {
    if (categorizedSkills[category].length === 0) {
      delete categorizedSkills[category];
    }
  });

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Your Skills</h2>
      <p className="text-gray-400 text-sm mb-6">
        These skills were extracted from your resume. Toggle skills to refine your job matches.
      </p>
      
      {Object.keys(categorizedSkills).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(categorizedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-gray-300 mb-3">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`text-sm px-3 py-1 rounded-full transition-colors ${
                      selectedSkills.has(skill)
                        ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                        : 'bg-gray-700 text-gray-400 border border-gray-600'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No skills extracted yet. Upload your resume to see your skills.</p>
        </div>
      )}
      
      <div className="mt-6 flex justify-between items-center">
        <span className="text-sm text-gray-400">
          {selectedSkills.size} of {skills.length} skills selected
        </span>
        <button
          onClick={() => {
            const allSelected = selectedSkills.size === skills.length;
            const newSelectedSkills = allSelected ? new Set<string>() : new Set(skills);
            setSelectedSkills(newSelectedSkills);
            
            if (onSkillToggle) {
              skills.forEach(skill => {
                if (allSelected !== newSelectedSkills.has(skill)) {
                  onSkillToggle(skill, newSelectedSkills.has(skill));
                }
              });
            }
          }}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          {selectedSkills.size === skills.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>
    </div>
  );
} 