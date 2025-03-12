'use client';

import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {ArrowRight} from 'lucide-react';
import {API_BASE_URL} from '@/lib/constants';

export default function JurisdictionalBoundaryForm() {
  const [regions, setRegions] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);

  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');

  const [loading, setLoading] = useState({
    regions: true,
    districts: false,
    wards: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch regions on component mount
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/south-africa`);
        if (!response.ok) {
          throw new Error('Failed to fetch regions');
        }
        const data = await response.json();
        setRegions(data); // API returns array directly
      } catch (err) {
        setError('Failed to load regions. Please try again later.');
        console.error(err);
      } finally {
        setLoading((prev) => ({...prev, regions: false}));
      }
    };

    fetchRegions();
  }, []);

  // Fetch districts when region changes
  useEffect(() => {
    if (!selectedRegion) {
      setDistricts([]);
      return;
    }

    const fetchDistricts = async () => {
      setLoading((prev) => ({...prev, districts: true}));
      try {
        const response = await fetch(
          `${API_BASE_URL}/south-africa?region=${encodeURIComponent(selectedRegion)}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch districts');
        }
        const data = await response.json();
        setDistricts(data); // API returns array directly
      } catch (err) {
        setError('Failed to load districts. Please try again later.');
        console.error(err);
      } finally {
        setLoading((prev) => ({...prev, districts: false}));
      }
    };

    fetchDistricts();
  }, [selectedRegion]);

  // Fetch wards when district changes
  useEffect(() => {
    if (!selectedRegion || !selectedDistrict) {
      setWards([]);
      return;
    }

    const fetchWards = async () => {
      setLoading((prev) => ({...prev, wards: true}));
      try {
        const response = await fetch(
          `${API_BASE_URL}/south-africa?region=${encodeURIComponent(
            selectedRegion,
          )}&district=${encodeURIComponent(selectedDistrict)}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch wards');
        }
        const data = await response.json();
        setWards(data); // API returns array directly
      } catch (err) {
        setError('Failed to load wards. Please try again later.');
        console.error(err);
      } finally {
        setLoading((prev) => ({...prev, wards: false}));
      }
    };

    fetchWards();
  }, [selectedRegion, selectedDistrict]);

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    setSelectedDistrict('');
    setSelectedWard('');
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedWard('');
  };

  return (
    <div className="flex flex-col gap-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex flex-col space-y-2">
        <Label>Region</Label>
        <Select value={selectedRegion} onValueChange={handleRegionChange}>
          <SelectTrigger className="w-full" disabled={loading.regions}>
            <SelectValue
              placeholder={loading.regions ? 'Loading...' : 'Select the region'}
            />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-2">
        <Label>District</Label>
        <Select
          value={selectedDistrict}
          onValueChange={handleDistrictChange}
          disabled={!selectedRegion || loading.districts}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                loading.districts ? 'Loading...' : 'Select the district'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {districts.map((district) => (
              <SelectItem key={district} value={district}>
                {district}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-2">
        <Label>Ward</Label>
        <Select
          value={selectedWard}
          onValueChange={setSelectedWard}
          disabled={!selectedDistrict || loading.wards}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={loading.wards ? 'Loading...' : 'Select the ward'}
            />
          </SelectTrigger>
          <SelectContent>
            {wards.map((ward) => (
              <SelectItem key={ward} value={ward}>
                {ward}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-right">
        <Button disabled={!selectedWard}>
          <ArrowRight />
          Next
        </Button>
      </div>
    </div>
  );
}
