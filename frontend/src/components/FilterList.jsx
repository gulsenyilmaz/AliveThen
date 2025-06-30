import React, { useState, useEffect} from 'react';

import './FilterList.css';
import Combobox from "react-widgets/Combobox";
import "react-widgets/styles.css";


function FilterList({ selectedOccupation, 
    occupations, 
    setSelectedOccupation, 
    genders, 
    selectedGender, 
    setSelectedGender,
    nationalities, 
    selectedNationality, 
    setSelectedNationality }) {
  

  return (
    <>


      <div className="filter_list">

        <div style={{ width: 300 }}>
            <Combobox
                data={
                    occupations?.map((occ) => ({
                    id: occ.id,
                    label: `${occ.name} (${occ.count || occ.co})`
                    })) || []
                }
                textField="label"
                valueField="name"
                filter="contains"
                value={selectedOccupation}
                onChange={(value) => setSelectedOccupation(value || "")}
                placeholder="All occupations"
                className="focus:outline-none"
                />
        </div>

        <div style={{ width: 300 }}>
            <Combobox
                data={
                    genders?.map((gen) => ({
                    id: gen.id,
                    label: `${gen.name} (${gen.count || gen.cg})`
                    })) || []
                }
                textField="label"
                valueField="id"
                filter="contains"
                value={selectedGender}
                onChange={(value) => setSelectedGender(value || "")}
                placeholder="All genders"
                className="focus:outline-none"
                />
        </div>

         <div style={{ width: 300 }}>
            <Combobox
                data={
                    nationalities?.map((nat) => ({
                    id: nat.id,
                    label: `${nat.name} (${nat.count || nat.cn})`
                    })) || []
                }
                textField="label"
                valueField="id"
                filter="contains"
                value={selectedNationality}
                onChange={(value) => setSelectedNationality(value || "")}
                placeholder="All nationalities"
                className="focus:outline-none"
                />
        </div>
        {/* <select
                      
            className="px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={selectedOccupation}
            onChange={(e) => setSelectedOccupation(e.target.value)}
        >
            <option value="">All occupations</option>
            {occupations && occupations.map((occ) => (
            <option key={occ.id} value={occ.id}>
                {occ.name} ({occ.co})
            </option>
            ))}
        </select>

      

        <select
                      
            className="border p-2 rounded bg-white text-black"
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
        >
            <option value="">All genders</option>
            {genders && genders.map((gen) => (
            <option key={gen.id} value={gen.id}>
                {gen.name} ({gen.cg})
            </option>
            ))}
        </select>

        <select
                      
            className="border p-2 rounded bg-white text-black"
            value={selectedNationality}
            onChange={(e) => setSelectedNationality(e.target.value)}
        >
            <option value="">All nationalities</option>
            {nationalities && nationalities.map((nat) => (
            <option key={nat.id} value={nat.id}>
                {nat.name} ({nat.cn})
            </option>
            ))}
        </select> */}
        
       
      </div> 
    </>
  );
}

export default FilterList;