import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from "styled-components";


const DistrictSelector = ({ onDistrictChange }) => {
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [subDistricts, setSubDistricts] = useState([]);

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        axios.get(`${apiUrl}/latlng/get`)
            .then(response => {
                setDistricts(response.data);
                console.log(districts);

            })
            .catch(error => console.error('Failed_district', error));
    }, []);

    const handleDistrictChange = (e) => {
        const district = e.target.value;
        setSelectedDistrict(district);
        const selected = districts.find(d => d.district === district);
        if (selected) {
            setSubDistricts(selected.subDistricts);
        }
        onDistrictChange(selected);
    };

    const handleSubDistrictChange = (e) => {
        const dong = e.target.value;
        const subDistrict = subDistricts.find(d => d.dong === dong);
        if (subDistrict) {
            onDistrictChange(subDistrict);
        }
    };

    return (
        <DropdownContainer>
            <StaticDropdown><option>서울시</option></StaticDropdown>
            <Dropdown onChange={handleDistrictChange}>
                {districts.map(d => (
                    <option key={d.district} value={d.district}>{d.district}</option>
                ))}
            </Dropdown>
            <Dropdown onChange={handleSubDistrictChange}>
                {subDistricts.map(s => (
                    <option key={s.dong} value={s.dong}>{s.dong}</option>
                ))}
            </Dropdown>
        </DropdownContainer>
    );
};

const StaticDropdown = styled.select`
  margin-bottom: 5px;
  padding: 10px;
  border: none;
  border-radius: 5px; 
  pointer-events: none;
  appearance: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);

`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: row;
  gap: 5px; 
  z-index: 1000;
`;

const Dropdown = styled.select`
  margin-bottom: 5px;
  padding: 10px;
  border: none;
  border-radius: 5px; 
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
`;

export default DistrictSelector;
