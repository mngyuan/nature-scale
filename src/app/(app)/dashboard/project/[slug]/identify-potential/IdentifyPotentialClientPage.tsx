'use client';

import {
  ArrowLeft,
  Calculator,
  Check,
  ChevronDown,
  Info,
  LoaderCircle,
  LoaderIcon,
} from 'lucide-react';
import {useState, useEffect, useRef} from 'react';
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
import {cn, countryNameFromCode} from '@/lib/utils';
import {useProjects} from '@/components/ProjectContext';
import {Tables} from '@/lib/supabase/types/supabase';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {R_API_BASE_URL, RESOURCE_TYPES} from '@/lib/constants';
import {EngagementType} from '@/components/CreateProjectForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {createClient} from '@/lib/supabase/client';
import {Checkbox} from '@/components/ui/checkbox';

const SETTLEMENT_SIZES = [
  '1-50',
  '51-100',
  '101-250',
  '251-1000',
  '1001 and up',
] as const;

const Stages = ({
  setPlotImage,
  setPlotImageLoading,
  serializedData,
  setSerializedData,
  imageDimensions,
  project,
  potentialAdopters,
  setPotentialAdopters,
}: {
  setPlotImage: (url: string) => void;
  setPlotImageLoading: (loading: boolean) => void;
  serializedData: string | null;
  setSerializedData: (serializedData: string | null) => void;
  imageDimensions: {width: number; height: number};
  project?: Tables<'projects'>;
  potentialAdopters: number | null;
  setPotentialAdopters: (count: number | null) => void;
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
        setSerializedData={setSerializedData}
        imageDimensions={imageDimensions}
      />
      <Stage2
        hidden={stage !== 2}
        setStage={setStage}
        setPlotImage={setPlotImage}
        setPlotImageLoading={setPlotImageLoading}
        country={project?.country_code}
        resourcesType={project?.details?.resourcesType || []}
        serializedData={serializedData}
        engagementType={project?.details?.engagementType}
        imageDimensions={imageDimensions}
        setPotentialAdopters={setPotentialAdopters}
        potentialAdopters={potentialAdopters}
      />
    </>
  );
};

const Stage1 = ({
  setPlotImage,
  setPlotImageLoading,
  setStage,
  hidden,
  country,
  setSerializedData,
  imageDimensions,
}: {
  setPlotImage: (url: string) => void;
  setPlotImageLoading: (loading: boolean) => void;
  setStage: (stage: number) => void;
  hidden: boolean | undefined;
  country?: string | null;
  setSerializedData: (serializedData: string | null) => void;
  imageDimensions: {width: number; height: number};
}) => {
  const [regions, setRegions] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);

  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');

  const [customBoundary, setCustomBoundary] = useState<FileList | null>(null);

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
            width: imageDimensions.width.toString(),
            height: imageDimensions.height.toString(),
          })}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch plot');
        }
        const respJSON = await response.json();
        setPlotImage(
          `data:${respJSON.plot.type};base64,${respJSON.plot.base64}`,
        );
        setSerializedData(respJSON.data);
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

  // Fetch plot on custom boundary upload
  useEffect(() => {
    if (!customBoundary || customBoundary.length === 0) {
      return;
    }
    const fetchPlot = async () => {
      if (!country) {
        return;
      }
      setPlotImageLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        for (const file of customBoundary) {
          formData.append('files', file);
        }
        const response = await fetch(
          `/api/area-of-interest-plot?${new URLSearchParams({
            width: imageDimensions.width.toString(),
            height: imageDimensions.height.toString(),
          })}`,
          {
            method: 'POST',
            body: formData,
          },
        );
        if (!response.ok) {
          console.log(response);
          throw new Error('Failed to fetch plot');
        }
        const respJSON = await response.json();
        setPlotImage(
          `data:${respJSON.plot.type};base64,${respJSON.plot.base64}`,
        );
        setSerializedData(respJSON.data);
      } catch (err) {
        setError('Failed to load plot. Please try again later.');
        console.error(err);
      } finally {
        setPlotImageLoading(false);
      }
    };

    fetchPlot();
  }, [customBoundary]);

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
          </div>
        </TabsContent>
        <TabsContent value="custom">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="custom-boundary">Custom boundary</Label>
            <Input
              id="custom-boundary"
              type="file"
              accept=".shp,.cpg,.dbf,.prj,.shx"
              multiple
              onChange={(e) => setCustomBoundary(e.target.files)}
            />
            <div className="text-right">
              <Button
                disabled={!customBoundary || customBoundary.length === 0}
                onClick={() => setStage(2)}
              >
                <ArrowRight />
                Next
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Stage2 = ({
  hidden,
  setStage,
  setPlotImage,
  setPlotImageLoading,
  country,
  serializedData,
  resourcesType,
  engagementType,
  imageDimensions,
  potentialAdopters,
  setPotentialAdopters,
}: {
  setPlotImage: (url: string) => void;
  setPlotImageLoading: (loading: boolean) => void;
  hidden: boolean | undefined;
  setStage: (stage: number) => void;
  country?: string | null;
  serializedData: string | null;
  resourcesType?: string[];
  engagementType: EngagementType | undefined;
  imageDimensions: {width: number; height: number};
  potentialAdopters: number | null;
  setPotentialAdopters: (count: number | null) => void;
}) => {
  const [bufferAmount, setBufferAmount] = useState<number>(0);
  const [settlementSizes, setSettlementSizes] = useState<string[]>([]);
  const [useBuffer, setUseBuffer] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSettlementAdopterData = async () => {
    setError(null);
    setPlotImageLoading(true);
    setLoading(true);
    try {
      const response = await fetch(
        // Vercel server function times out in 60s so directly call the R API
        // `/api/forecast-graph?${new URLSearchParams({
        `${R_API_BASE_URL}/potential-adopters/settlements?${new URLSearchParams(
          {
            countries: JSON.stringify(
              country ? countryNameFromCode(country) : '',
            ),
            resourceTypes: JSON.stringify(
              resourcesType?.map(
                (resource: string): number => RESOURCE_TYPES[resource].value,
              ),
            ),
            ...(useBuffer
              ? {
                  bufferDistance: JSON.stringify(bufferAmount),
                }
              : {}),
            settlementSizes: JSON.stringify(settlementSizes),
            width: imageDimensions.width.toString(),
            height: imageDimensions.height.toString(),
          },
        )}`,
        {
          method: 'POST',
          body: JSON.stringify(serializedData),
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch plot');
      }
      const respJSON = await response.json();
      setPlotImage(`data:${respJSON.plot.type};base64,${respJSON.plot.base64}`);
      setPotentialAdopters(respJSON.potentialAdopters);
      setDialogOpen(true);
    } catch (err) {
      setError(
        'Failed to load settlements data and plot. Please try again later.',
      );
      console.error(err);
    } finally {
      setPlotImageLoading(false);
      setLoading(false);
    }
  };

  const fetchIndividualAdopterData = async () => {
    setError(null);
    try {
      setLoading(true);
      const response = await fetch(
        // Vercel server function times out in 60s so directly call the R API
        // `/api/forecast-graph?${new URLSearchParams({
        `${R_API_BASE_URL}/potential-adopters/individuals?${new URLSearchParams(
          {
            resourceTypes: JSON.stringify(
              resourcesType?.map(
                (resource: string): number => RESOURCE_TYPES[resource].value,
              ),
            ),
            ...(useBuffer
              ? {
                  bufferDistance: JSON.stringify(bufferAmount),
                }
              : {}),
          },
        )}`,
        {
          method: 'POST',
          body: JSON.stringify(serializedData),
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch plot');
      }
      const respJSON = await response.json();
      setPotentialAdopters(respJSON[0]);
      setDialogOpen(true);
    } catch (err) {
      setError('Failed to load individuals data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      {engagementType === 'settlement' && (
        <div className="flex flex-col space-y-2">
          <Label>Settlement size (in persons)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-between h-auto',
                  !settlementSizes.length && 'text-muted-foreground',
                )}
              >
                <div className="flex flex-wrap gap-2">
                  {settlementSizes.length > 0
                    ? settlementSizes.map((item) => (
                        <div
                          key={item}
                          className="bg-black text-white rounded-md px-2 py-1 text-xs flex items-center"
                        >
                          {item}
                        </div>
                      ))
                    : 'Select settlement sizes'}
                </div>
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search settlement size..." />
                <CommandEmpty>No settlement size found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {SETTLEMENT_SIZES.map((settlementSize) => (
                    <CommandItem
                      key={settlementSize}
                      onSelect={() =>
                        setSettlementSizes(
                          settlementSizes.includes(settlementSize)
                            ? settlementSizes.filter(
                                (item) => item !== settlementSize,
                              )
                            : [...settlementSizes, settlementSize],
                        )
                      }
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          settlementSizes.includes(settlementSize)
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50',
                        )}
                      >
                        {settlementSizes.includes(settlementSize) && (
                          <Check className="h-3 w-3" />
                        )}
                      </div>
                      {settlementSize}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between gap-2">
          <Label>
            Restrict to {engagementType}s within buffer distance (km) from{' '}
            {resourcesType && resourcesType?.length > 0
              ? resourcesType.join(', ')
              : 'resources'}
          </Label>
          <Checkbox
            checked={useBuffer}
            onCheckedChange={(checked) =>
              setUseBuffer(checked === 'indeterminate' ? false : checked)
            }
            className="h-4 w-4"
          />
        </div>
        <div
          className={`flex flex-row items-center justify-between ${
            useBuffer ? '' : 'text-muted-foreground pointer-events-none'
          }`}
        >
          <Label>Buffer from resources (km)</Label>
          <Input
            placeholder="0"
            className="w-16 text-center border-transparent hover:border-input hover:border text-muted-foreground hover:text-inherit focus:text-inherit"
            type="number"
            value={bufferAmount}
            onChange={(e) => setBufferAmount(parseInt(e.target.value))}
            disabled={!useBuffer}
          />
        </div>
        <Slider
          max={10}
          min={1}
          step={1}
          className="py-2"
          value={[bufferAmount]}
          onValueChange={(values) => setBufferAmount(values[0])}
          disabled={!useBuffer}
        />
        {bufferAmount > 0 && engagementType === 'settlement' ? (
          <p className="text-xs text-muted-foreground">
            Using a buffer will cause the calculation to take longer than usual.
          </p>
        ) : null}
      </div>
      <div className="flex flex-row justify-between">
        <Button onClick={() => setStage(1)}>
          <ArrowLeft />
          Previous
        </Button>
        <Button
          disabled={
            loading ||
            (engagementType === 'settlement'
              ? !(settlementSizes.length > 0)
              : false)
          }
          role="submit"
          onClick={() =>
            engagementType === 'settlement'
              ? fetchSettlementAdopterData()
              : fetchIndividualAdopterData()
          }
        >
          {loading ? <LoaderCircle className="animate-spin" /> : <Calculator />}
          {loading ? 'Loading ...' : 'Calculate'}
        </Button>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Potential adopters updated!</DialogTitle>
            <DialogDescription>
              The number of potential adopters has been updated to{' '}
              {potentialAdopters}.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setDialogOpen(false)}>Okay</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default function IdentifyPotentialClientPage({
  project,
}: {
  project?: Tables<'projects'>;
}) {
  const supabase = createClient();
  // Update context store with project data from server
  const {updateProjects} = useProjects();
  useEffect(() => {
    if (project && project.id && updateProjects) {
      updateProjects({[project.id]: project});
    }
  }, [project, updateProjects]);

  const [plotImage, setPlotImage] = useState<string | null>(null);
  const [plotImageLoading, setPlotImageLoading] = useState(false);
  const [serializedData, setSerializedData] = useState<string | null>(null);
  const [potentialAdopters, setPotentialAdopters] = useState<number | null>(
    null,
  );

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageDimensions = useRef<{width: number; height: number}>({
    width: 0,
    height: 0,
  });

  const updateImageDimensions = () => {
    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      imageDimensions.current.width = rect.width;
      imageDimensions.current.height = rect.height;
    }
  };

  useEffect(() => {
    updateImageDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateImageDimensions();
    });
    if (imageContainerRef.current) {
      resizeObserver.observe(imageContainerRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const updatePotentialAdopters = async () => {
      if (project?.id === undefined || potentialAdopters === null) {
        return;
      }

      const {data, error} = await supabase
        .from('projects')
        .update({
          details: {
            ...project?.details,
            potentialAdopters: potentialAdopters?.toString() || '',
          },
        })
        .eq('id', Number(project?.id))
        .select();
      if (error) {
        console.error('Error updating potentialAdopters:', error);
        // TODO: display to user
        // alert('Error updating potential adopters');
      } else {
        // TODO: show a success toast?
        console.log('Potential adopters updated successfully', data);
      }
    };

    updatePotentialAdopters();
  }, [potentialAdopters]);

  return (
    <>
      <Stages
        setPlotImage={setPlotImage}
        setPlotImageLoading={setPlotImageLoading}
        serializedData={serializedData}
        setSerializedData={setSerializedData}
        imageDimensions={imageDimensions.current}
        project={project}
        potentialAdopters={potentialAdopters}
        setPotentialAdopters={setPotentialAdopters}
      />
      <div className="flex flex-col grow">
        <span>
          <h2 className="text-sm text-muted-foreground inline">Location </h2>
          <span className="font-semibold text-sm text-right">
            {project?.country_code && countryNameFromCode(project.country_code)}
          </span>
        </span>
        {potentialAdopters !== null && (
          <span>
            <h2 className="text-sm text-muted-foreground inline">
              {project?.details?.engagementType === 'settlement'
                ? 'Eligible Settlements'
                : 'Eligible Individuals'}
            </h2>{' '}
            <span className="font-semibold text-sm text-right">
              {project?.details?.engagementType === 'settlement' && (
                <div className="rounded-xl h-3 w-3 bg-[#dd3487] inline-block mx-1" />
              )}
              {potentialAdopters}
            </span>
          </span>
        )}
        <div
          className="flex items-center justify-center h-full"
          ref={imageContainerRef}
        >
          {plotImageLoading ? (
            <LoaderIcon className="animate-spin" />
          ) : plotImage ? (
            <img src={plotImage} className="object-contain h-full" alt="Plot" />
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
