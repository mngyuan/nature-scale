'use client';

import {useState} from 'react';
import {UserIcon, UsersIcon} from 'lucide-react';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';

const DiagnosticItem = ({
  title,
  value,
  description,
}: {
  title: string;
  value?: string;
  description?: string;
}) => {
  const idPrefix = title.toLowerCase().replace(/\s+/g, '-');

  const [selectedValue, setSelectedValue] = useState(value || null);
  return (
    <div className="contents">
      <div className="flex flex-col space-y-2">
        <Label>{title}</Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <RadioGroup
        value={selectedValue || ''}
        onValueChange={setSelectedValue}
        className="flex flex-row"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1" id={`${idPrefix}-1`} />
          <Label htmlFor={`${idPrefix}-1`}>Agree</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="2" id={`${idPrefix}-2`} />
          <Label htmlFor={`${idPrefix}-2`}>Neither agree nor disagree</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="3" id={`${idPrefix}-3`} />
          <Label htmlFor={`${idPrefix}-3`}>Disagree</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="4" id={`${idPrefix}-4`} />
          <Label htmlFor={`${idPrefix}-4`}>Not applicable</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default function ContextDiagnosticForm() {
  return (
    <div className="flex flex-col grow px-8 pb-8 space-y-4 w-full">
      <div className="grid grid-cols-[1fr_auto] gap-4">
        <div className="col-span-2">
          <h2 className="font-semibold text-md">
            <UserIcon className="inline mr-2" size={16} />
            Individual Uptake
          </h2>
        </div>
        <DiagnosticItem
          title="Overall Benefits vs Costs"
          description="Overall, engaging in [the initiative] will be advantageous for participants and outweighs the costs of adoption and implementation"
        />
        <DiagnosticItem
          title="Financial Benefits"
          description="Engaging in [the initiative] has meaningful net financial benefits for participants."
        />
        <DiagnosticItem
          title="Environmental Benefit"
          description="Engaging in [the initiative] has meaningful benefits to local environmental conditions of participants."
        />
        <DiagnosticItem
          title="Direct Needs Alignment"
          description="[The initiative] directly addresses critical needs of potential participants."
        />
        <DiagnosticItem
          title="Simplicity"
          description="The [initiative] is easy to understand and engage with."
        />
        <DiagnosticItem
          title="Compatible with practices"
          description="Engaging in [the initiative] generally requires very few and/or very easy modifications to the current practices of participants."
        />
        <DiagnosticItem
          title="Adaptability"
          description="[The initiative] includes many actions that can be conducted, adapted, or excluded to meet different contexts and suit the needs of the participant."
        />
        <DiagnosticItem
          title="Trialability"
          description="[The initiative] and/or required actions are easy and low-risk for participants to trial and later disengage."
        />
        <DiagnosticItem
          title="Empowerment"
          description="The potential participants are politically empowered to make decisions on what to adopt and how."
        />
        <DiagnosticItem
          title="Economic wellbeing"
          description="Potential participants generally have surplus financial and/or other livelihood resources (e.g., access to food)."
        />
        <div className="col-span-2">
          <h2 className="font-semibold text-md">
            <UserIcon className="inline mr-2" size={16} />
            Individual Uptake and
            <UsersIcon className="inline mx-2" size={16} />
            Social Transmission
          </h2>
        </div>
        <DiagnosticItem
          title="Timing of benefits"
          description="Key benefits of the [the initiative] are nearly immediate for all participants."
        />
        <DiagnosticItem
          title="Observable"
          description="The benefits of participating in the initiative are highly visible and evident to others."
        />
        <DiagnosticItem
          title="Community Visibility"
          description="Potential participants can easily see who in their community is participating in [the initiative]."
        />
        <DiagnosticItem
          title="Policy Support"
          description="The [initiative] is strongly supported by both international and national policies."
        />
        <DiagnosticItem
          title="Technical Support"
          description="Comprehensive and reliable technical support is available to assist participants in adopting and implementing the initiative."
        />
        <div className="col-span-2">
          <h2 className="font-semibold text-md">
            <UsersIcon className="inline mr-2" size={16} />
            Social Transmission
          </h2>
        </div>
        <DiagnosticItem
          title="Reputational benefits"
          description="Engaging in [the initiative] has meaningful net social benefits (e.g. tenure, reputation, connections) for participants."
        />
        <DiagnosticItem
          title="Understanding"
          description="The [initiative] is simple to understand and use."
        />
        <DiagnosticItem
          title="Social connectivity"
          description="Potential participants have well-developed ways of sharing knowledge and strong social connections to facilitate the spread of information."
        />
        <DiagnosticItem
          title="Proximity"
          description="Potential participants are geographically well-connected, driving frequent social interaction."
        />
        <DiagnosticItem
          title="Local champions"
          description="Influential local champions actively promote [the initiative]."
        />
      </div>
      <Button role="submit" className="mx-auto mt-4" disabled>
        Submit
      </Button>
      <Tooltip>
        <TooltipTrigger>
          <p className="text-sm text-muted-foreground text-center">
            Coming soon!
          </p>
        </TooltipTrigger>
        <TooltipContent>
          Thanks for trying the early access version.
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
