'use client';

import {ArrowLeft, Info, LoaderIcon} from 'lucide-react';
import {useState, useEffect} from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {ArrowRight} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {API_BASE_URL} from '@/lib/constants';
import {Separator} from '@/components/ui/separator';
import {Slider} from '@/components/ui/slider';

const Stages = ({
  setPlotImage,
  setPlotImageLoading,
}: {
  setPlotImage: (url: string) => void;
  setPlotImageLoading: (loading: boolean) => void;
}) => {
  const [stage, setStage] = useState<number>(1);
  return (
    <>
      <Stage1
        hidden={stage !== 1}
        setPlotImage={setPlotImage}
        setPlotImageLoading={setPlotImageLoading}
        setStage={setStage}
      />
      <Stage2 hidden={stage !== 2} setStage={setStage} />
    </>
  );
};

const Stage1 = ({
  setPlotImage,
  setPlotImageLoading,
  setStage,
  hidden,
}: {
  setPlotImage: (url: string) => void;
  setPlotImageLoading: (loading: boolean) => void;
  setStage: (stage: number) => void;
  hidden: boolean | undefined;
}) => {
  const [regions, setRegions] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);

  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState({
    regions: true,
    districts: false,
    wards: false,
  });

  // Fetch regions on component mount
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/boundary-names?${new URLSearchParams({
            country: 'South Africa',
          })}`,
        );
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
      if (selectedRegion === 'Any') {
        setDistricts([]);
        return;
      }
      setLoading((prev) => ({...prev, districts: true}));
      try {
        const response = await fetch(
          `${API_BASE_URL}/boundary-names?${new URLSearchParams({
            country: 'South Africa',
            region: selectedRegion,
          })}`,
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
      if (selectedDistrict === 'Any') {
        setWards([]);
        return;
      }
      setLoading((prev) => ({...prev, wards: true}));
      try {
        const response = await fetch(
          `${API_BASE_URL}/boundary-names?${new URLSearchParams({
            country: 'South Africa',
            region: selectedRegion,
            district: selectedDistrict,
          })}`,
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

  // Fetch image from r API when ward changes or selection ends with 'Any'
  const isValidSelection = (
    selectedRegion: string,
    selectedDistrict: string,
    selectedWard: string,
  ) => {
    return (
      selectedRegion === 'Any' ||
      (selectedRegion !== '' && selectedDistrict === 'Any') ||
      (selectedRegion !== '' &&
        selectedDistrict !== '' &&
        selectedWard === 'Any') ||
      (selectedRegion !== '' && selectedDistrict !== '' && selectedWard !== '')
    );
  };

  useEffect(() => {
    if (!isValidSelection(selectedRegion, selectedDistrict, selectedWard)) {
      return;
    }

    const fetchPlot = async () => {
      setPlotImageLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/plot-area-of-interest?${new URLSearchParams({
            country: 'South Africa',
            region: selectedRegion === 'Any' ? '' : selectedRegion,
            district: selectedDistrict === 'Any' ? '' : selectedDistrict,
            ward: selectedWard === 'Any' ? '' : selectedWard,
          })}`,
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
        setPlotImageLoading(false);
      }
    };

    fetchPlot();
  }, [
    selectedRegion,
    selectedDistrict,
    selectedWard,
    setPlotImage,
    setPlotImageLoading,
  ]);

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
    <div className={`${hidden ? 'hidden' : ''} flex flex-col space-y-4`}>
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
              <Select value={selectedRegion} onValueChange={handleRegionChange}>
                <SelectTrigger className="w-full" disabled={loading.regions}>
                  <SelectValue
                    placeholder={
                      loading.regions ? 'Loading...' : 'Select the region'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any</SelectItem>
                  <Separator className="my-2" />
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
                disabled={
                  !selectedRegion ||
                  loading.districts ||
                  selectedRegion === 'Any'
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      loading.districts ? 'Loading...' : 'Select the district'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any</SelectItem>
                  <Separator className="my-2" />
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
                disabled={
                  !selectedDistrict ||
                  loading.wards ||
                  selectedDistrict === 'Any'
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      loading.wards ? 'Loading...' : 'Select the ward'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any</SelectItem>
                  <Separator className="my-2" />
                  {wards.map((ward) => (
                    <SelectItem key={ward} value={ward}>
                      {ward}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-right">
              <Button
                disabled={
                  !isValidSelection(
                    selectedRegion,
                    selectedDistrict,
                    selectedWard,
                  )
                }
                onClick={() => setStage(2)}
              >
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
  );
};

const Stage2 = ({
  hidden,
  setStage,
}: {
  hidden: boolean | undefined;
  setStage: (stage: number) => void;
}) => {
  return (
    <div className={`${hidden ? 'hidden' : ''} flex flex-col space-y-4`}>
      <div className="flex flex-row items-center space-x-1">
        <p className="font-semibold text-sm">Eligibility</p>
        <Tooltip>
          <TooltipTrigger>
            <Info size={16} />
          </TooltipTrigger>
          <TooltipContent>Assess Progress</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex flex-col space-y-2">
        <Label>Economic wellbeing of the target</Label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={'Select one economic wellbeing category'}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <Separator className="my-2" />
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col space-y-2">
        <Label>Economic wellbeing of the target</Label>
        <Slider defaultValue={[50]} max={100} step={1} className="py-2" />
      </div>
      <div className="flex flex-row justify-between">
        <Button onClick={() => setStage(1)}>
          <ArrowLeft />
          Previous
        </Button>
        <Button disabled>
          <ArrowRight />
          Next
        </Button>
      </div>
    </div>
  );
};

export default function Page() {
  const [plotImage, setPlotImage] = useState<string | null>(null);

  const [plotImageLoading, setPlotImageLoading] = useState(false);

  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Identify scaling potential and targets</h2>
      <div className="flex flex-row px-8 pb-8 space-x-6">
        <Stages
          setPlotImage={setPlotImage}
          setPlotImageLoading={setPlotImageLoading}
        />
        <div className="flex flex-col grow">
          <h2 className="text-sm text-muted-foreground">Location</h2>
          <p className="font-semibold text-sm">South Africa</p>
          <div className="w-[480px] h-[480px] flex items-center justify-center">
            {plotImageLoading ? (
              <LoaderIcon className="animate-spin" />
            ) : plotImage ? (
              <img src={plotImage} width={480} height={480} alt="Plot" />
            ) : (
              <div className="text-sm text-muted-foreground">
                Select or upload a project boundary
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
