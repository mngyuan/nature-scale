'use client';

import {Info} from 'lucide-react';
import {useState, useEffect} from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {ArrowRight} from 'lucide-react';
import Image from 'next/image';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {API_BASE_URL} from '@/lib/constants';

export default function Page() {
  const [regions, setRegions] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);
  const [plotImage, setPlotImage] = useState<string | null>(null);

  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');

  const [loading, setLoading] = useState({
    regions: true,
    districts: false,
    wards: false,
    plotImage: false,
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
          `${API_BASE_URL}/boundary-names?country=${encodeURIComponent(
            'South Africa',
          )}&region=${encodeURIComponent(
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

  // Fetch image from r API when ward changes
  useEffect(() => {
    if (!selectedRegion || !selectedDistrict || !selectedWard) {
      return;
    }

    const fetchPlot = async () => {
      setLoading((prev) => ({...prev, plotImage: true}));
      try {
        const response = await fetch(
          `${API_BASE_URL}/plot-area-of-interest?country=${encodeURIComponent(
            'South Africa',
          )}&region=${encodeURIComponent(
            selectedRegion,
          )}&district=${encodeURIComponent(selectedDistrict)}&ward=${encodeURIComponent(
            selectedWard,
          )}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch plot');
        }
        const objURL = URL.createObjectURL(await response.blob());
        setPlotImage(objURL);
      } catch (err) {
        setError('Failed to load plot. Please try again later.');
        console.error(err);
      } finally {
        setLoading((prev) => ({...prev, plotImage: false}));
      }
    };

    fetchPlot();
  }, [selectedRegion, selectedDistrict, selectedWard]);

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
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Identify scaling potential and targets</h2>
      <div className="flex flex-row px-8 pb-8 space-x-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row items-center space-x-1">
            <p className="font-semibold text-sm">Project boundary</p>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} />
              </TooltipTrigger>
              <TooltipContent>Assess Progress</TooltipContent>
            </Tooltip>
          </div>
          <Tabs defaultValue="jurisdictional">
            <TabsList className="grid w-full grid-cols-2 h-full mb-2">
              <TabsTrigger
                value="jurisdictional"
                className="flex flex-col items-start p-4 text-wrap whitespace-normal text-left"
              >
                <p className="">Jurisdictional</p>
                <p className="font-normal">
                  Enter your project's legally-defined operational area
                </p>
              </TabsTrigger>
              <TabsTrigger
                value="custom"
                className="flex flex-col items-start p-4 text-wrap whitespace-normal text-left"
              >
                <p className="">Custom</p>
                <p className="font-normal">
                  Upload the custom boundaries of your project
                </p>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="jurisdictional">
              <div className="flex flex-col gap-4">
                {error && <div className="text-red-500 text-sm">{error}</div>}

                <div className="flex flex-col space-y-2">
                  <Label>Region</Label>
                  <Select
                    value={selectedRegion}
                    onValueChange={handleRegionChange}
                  >
                    <SelectTrigger
                      className="w-full"
                      disabled={loading.regions}
                    >
                      <SelectValue
                        placeholder={
                          loading.regions ? 'Loading...' : 'Select the region'
                        }
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
                          loading.districts
                            ? 'Loading...'
                            : 'Select the district'
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
                        placeholder={
                          loading.wards ? 'Loading...' : 'Select the ward'
                        }
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
              </div>{' '}
            </TabsContent>
            <TabsContent value="custom">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="custom-boundary">Custom boundary</Label>
                <Input id="custom-boundary" type="file" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex flex-col grow">
          <h2 className="text-sm text-muted-foreground">Location</h2>
          <p className="font-semibold text-sm">South Africa</p>
          {plotImage ? (
            <img src={plotImage} width={480} height={480} alt="Plot" />
          ) : (
            <Image src="/placeholder.png" width={400} height={400} alt="Plot" />
          )}
        </div>
      </div>
    </main>
  );
}
