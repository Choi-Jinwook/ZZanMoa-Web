import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from "styled-components";

interface SubDistrict {
    dong: string;
    latitude: number;
    longitude: number;
}

interface District {
    district: string;
    subDistricts: SubDistrict[];
}
interface DistrictSelectorProps {
    onDistrictChange: (location: SubDistrict | District) => void;
    currentLocation: { lat: number; lng: number };
}

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const DistrictSelector = ({ onDistrictChange, currentLocation } : DistrictSelectorProps) => {
    const [districts, setDistricts] = useState<District[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);
    const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>('');

    useEffect(() => {
        axios.get<District[]>(`${apiUrl}/latlng/get`)
            .then(response => {
                setDistricts(response.data);
                autoSelectDistrict(response.data);
            })
            .catch(error => console.error('Failed to fetch districts', error));
    }, [currentLocation.lat, currentLocation.lng]);

    const autoSelectDistrict = (districts: District[]) => {
        let nearestDistance = Infinity;
        let nearestSubDistrict: SubDistrict | null = null;
        let nearestDistrict: District | null = null;

        districts.forEach(district => {
            district.subDistricts.forEach(sub => {
                const distance = Math.sqrt(
                    (sub.longitude - currentLocation.lat) ** 2 +
                    (sub.latitude - currentLocation.lng) ** 2
                );
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestSubDistrict = sub;
                    nearestDistrict = district;
                }
            });
        });

        if (nearestDistrict && nearestSubDistrict) {
            setSelectedDistrict(nearestDistrict.district);
            setSelectedSubDistrict(nearestSubDistrict.dong);
            setSubDistricts(nearestDistrict.subDistricts);
        }
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtName = e.target.value;
        const district = districts.find(d => d.district === districtName);
        if (district) {
            setSubDistricts(district.subDistricts);
            setSelectedDistrict(districtName);
            if (district.subDistricts.length > 0) {
                setSelectedSubDistrict(district.subDistricts[0].dong);
                // 드롭다운 구 설정시 지도 이동
                // onDistrictChange(district.subDistricts[0]); 
            }
        }
    };

    const handleSubDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const dongName = e.target.value;
        const subDistrict = subDistricts.find(d => d.dong === dongName);
        if (subDistrict) {
            setSelectedSubDistrict(dongName);
            onDistrictChange(subDistrict);
        }
    };

    return (
        <DropdownContainer>
            <StaticDropdown><option>서울시</option></StaticDropdown>
            <Dropdown
                value={selectedDistrict}
                onChange={handleDistrictChange}>
                {districts.map(d => (
                    <option key={d.district} value={d.district}>{d.district}</option>
                ))}
            </Dropdown>
            <Dropdown
                value={selectedSubDistrict}
                onChange={handleSubDistrictChange}>
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
