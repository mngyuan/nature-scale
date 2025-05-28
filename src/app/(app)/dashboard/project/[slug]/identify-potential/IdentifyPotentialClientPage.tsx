'use client';

import {ArrowLeft, Calculator, Info, LoaderIcon} from 'lucide-react';
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
import {Separator} from '@/components/ui/separator';
import {Slider} from '@/components/ui/slider';
import {getBoundaryNames} from './actions';
import {countryNameFromCode} from '@/lib/utils';
import {useProjects} from '@/components/ProjectContext';
import {Tables} from '@/lib/supabase/types/supabase';

const Stages = ({
  setPlotImage,
  setPlotImageLoading,
  project,
}: {
  setPlotImage: (url: string) => void;
  setPlotImageLoading: (loading: boolean) => void;
  project?: Tables<'projects'>;
}) => {
  const [stage, setStage] = useState<number>(1);
  return (
    <>
      <Stage1
        hidden={stage !== 1}
        setPlotImage={setPlotImage}
        setPlotImageLoading={setPlotImageLoading}
        setStage={setStage}
        country={project?.country_code}
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
  country,
}: {
  setPlotImage: (url: string) => void;
  setPlotImageLoading: (loading: boolean) => void;
  setStage: (stage: number) => void;
  hidden: boolean | undefined;
  country?: string | null;
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
      if (!country) {
        return;
      }
      setError(null);
      try {
        const data = await getBoundaryNames({
          country: countryNameFromCode(country),
        });
        setRegions(data); // API returns array directly
      } catch (err) {
        setError('Failed to load regions. Please try again later.');
        console.error(err);
      } finally {
        setLoading((prev) => ({...prev, regions: false}));
      }
    };

    fetchRegions();
  }, [country]);

  // Fetch districts when region changes
  useEffect(() => {
    if (!selectedRegion) {
      setDistricts([]);
      return;
    }

    const fetchDistricts = async () => {
      if (!country) {
        return;
      }
      if (selectedRegion === 'Any') {
        setDistricts([]);
        return;
      }
      setLoading((prev) => ({...prev, districts: true}));
      setError(null);
      try {
        const data = await getBoundaryNames({
          country: countryNameFromCode(country),
          region: selectedRegion,
        });
        setDistricts(data); // API returns array directly
      } catch (err) {
        setError('Failed to load districts. Please try again later.');
        console.error(err);
      } finally {
        setLoading((prev) => ({...prev, districts: false}));
      }
    };

    fetchDistricts();
  }, [selectedRegion, country]);

  // Fetch wards when district changes
  useEffect(() => {
    if (!selectedRegion || !selectedDistrict) {
      setWards([]);
      return;
    }

    const fetchWards = async () => {
      if (!country) {
        return;
      }
      if (selectedDistrict === 'Any') {
        setWards([]);
        return;
      }
      setLoading((prev) => ({...prev, wards: true}));
      setError(null);
      try {
        const data = await getBoundaryNames({
          country: countryNameFromCode(country),
          region: selectedRegion,
          district: selectedDistrict,
        });
        setWards(data); // API returns array directly
      } catch (err) {
        setError('Failed to load wards. Please try again later.');
        console.error(err);
      } finally {
        setLoading((prev) => ({...prev, wards: false}));
      }
    };

    fetchWards();
  }, [selectedRegion, selectedDistrict, country]);

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
      if (!country) {
        return;
      }
      setPlotImageLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/area-of-interest-plot?${new URLSearchParams({
            country: countryNameFromCode(country),
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
    country,
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
  const [bufferAmount, setBufferAmount] = useState<number>(5);
  const [economicWellbeing, setEconomicWellbeing] = useState<string>('Any');

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
        <Select value={economicWellbeing} onValueChange={setEconomicWellbeing}>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={'Select one economic wellbeing category'}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Any">Any</SelectItem>
            <Separator className="my-2" />
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row items-center justify-between">
          <Label>Buffer from resources (km)</Label>
          <Input
            placeholder="0"
            className="w-16 text-center border-transparent hover:border-input hover:border text-muted-foreground hover:text-inherit focus:text-inherit"
            type="number"
            value={bufferAmount}
            onChange={(e) => setBufferAmount(parseInt(e.target.value))}
          />
        </div>
        <Slider
          max={30}
          step={1}
          className="py-2"
          value={[bufferAmount]}
          onValueChange={(values) => setBufferAmount(values[0])}
        />
      </div>
      <div className="flex flex-row justify-between">
        <Button onClick={() => setStage(1)}>
          <ArrowLeft />
          Previous
        </Button>
        <Button disabled={!(bufferAmount && economicWellbeing)}>
          <Calculator />
          Calculate
        </Button>
      </div>
    </div>
  );
};

export default function IdentifyPotentialClientPage({
  project,
}: {
  project?: Tables<'projects'>;
}) {
  // Update context store with project data from server
  const {updateProjects} = useProjects();
  useEffect(() => {
    if (project && project.id && updateProjects) {
      updateProjects({[project.id]: project});
    }
  }, [project, updateProjects]);

  const [plotImage, setPlotImage] = useState<string | null>(null);
  const [plotImageLoading, setPlotImageLoading] = useState(false);

  return (
    <>
      <Stages
        setPlotImage={setPlotImage}
        setPlotImageLoading={setPlotImageLoading}
        project={project}
      />
      <div className="flex flex-col grow">
        <h2 className="text-sm text-muted-foreground">Location</h2>
        <p className="font-semibold text-sm">
          {project?.country_code && countryNameFromCode(project.country_code)}
        </p>
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
    </>
  );
}
