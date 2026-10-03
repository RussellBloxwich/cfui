import * as React from "react";
import * as UI from "cfui";
import { useForm } from "react-hook-form";
import { Example } from "../shared.js";

function BasicFields() {
  const id = React.useId();
  const [name, setName] = React.useState("storefront");
  const [description, setDescription] = React.useState("The customer-facing application.");

  return (
    <Example title="Text fields" modules={["input", "textarea", "label", "field"]}>
      <UI.FieldGroup>
        <UI.Field>
          <UI.FieldLabel htmlFor={`${id}-name`}>Application name</UI.FieldLabel>
          <UI.Input id={`${id}-name`} value={name} onChange={(event) => setName(event.target.value)} aria-describedby={`${id}-name-help`} />
          <UI.FieldDescription id={`${id}-name-help`}>A name your team can recognize.</UI.FieldDescription>
        </UI.Field>
        <div className="gallery-field">
          <UI.Label htmlFor={`${id}-description`}>Description</UI.Label>
          <UI.Textarea id={`${id}-description`} rows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
        </div>
        <UI.Field data-invalid>
          <UI.FieldLabel htmlFor={`${id}-invalid`}>Reserved application name</UI.FieldLabel>
          <UI.Input id={`${id}-invalid`} defaultValue="admin" aria-invalid="true" aria-describedby={`${id}-invalid-help`} />
          <UI.FieldError id={`${id}-invalid-help`}>This name is reserved. Choose another name.</UI.FieldError>
        </UI.Field>
        <UI.Field>
          <UI.FieldLabel htmlFor={`${id}-disabled`}>Assigned identifier</UI.FieldLabel>
          <UI.Input id={`${id}-disabled`} value="APP-204" disabled />
        </UI.Field>
      </UI.FieldGroup>
      <p className="gallery-status" role="status">Editing {name || "an unnamed application"}; description has {description.length} characters.</p>
    </Example>
  );
}

function InputGroups() {
  const id = React.useId();
  const [hostname, setHostname] = React.useState("storefront");
  const [copied, setCopied] = React.useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(`https://${hostname}.workers.dev`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Example title="Input addons" modules={["input-group"]} note="Addon composition is an inferred extension of the captured Cloudflare field styling.">
      <div className="gallery-stack">
        <div className="gallery-field">
          <UI.Label htmlFor={`${id}-host`}>Preview address</UI.Label>
          <UI.InputGroup>
            <UI.InputGroupInput id={`${id}-host`} value={hostname} onChange={(event) => { setHostname(event.target.value); setCopied(false); }} />
            <UI.InputGroupAddon align="inline-start"><UI.InputGroupText>https://</UI.InputGroupText></UI.InputGroupAddon>
            <UI.InputGroupAddon align="inline-end"><UI.InputGroupText>.workers.dev</UI.InputGroupText></UI.InputGroupAddon>
          </UI.InputGroup>
        </div>
        <div className="gallery-field">
          <UI.Label htmlFor={`${id}-notes`}>Deployment notes</UI.Label>
          <UI.InputGroup>
            <UI.InputGroupTextarea id={`${id}-notes`} placeholder="Summarize what changed…" rows={3} />
            <UI.InputGroupAddon align="block-end">
              <UI.InputGroupText>Only your team can see these notes.</UI.InputGroupText>
              <UI.InputGroupButton type="button" onClick={copyAddress}>Copy address</UI.InputGroupButton>
            </UI.InputGroupAddon>
          </UI.InputGroup>
        </div>
      </div>
      <p className="gallery-status" role="status">{copied ? "Preview address copied." : `Preview: https://${hostname || "application"}.workers.dev`}</p>
    </Example>
  );
}

function ChoiceControls() {
  const id = React.useId();
  const [logging, setLogging] = React.useState(true);
  const [cache, setCache] = React.useState("standard");
  const [preview, setPreview] = React.useState(false);

  return (
    <Example title="Choices and toggles" modules={["checkbox", "radio-group", "switch"]}>
      <div className="gallery-stack">
        <div className="gallery-row">
          <UI.Checkbox id={`${id}-logging`} checked={logging} onCheckedChange={(value) => setLogging(value === true)} />
          <UI.Label htmlFor={`${id}-logging`}>Save request logs</UI.Label>
        </div>
        <div className="gallery-row">
          <UI.Checkbox id={`${id}-mixed`} checked="indeterminate" aria-label="Some environments selected" />
          <UI.Label htmlFor={`${id}-mixed`}>Some environments selected</UI.Label>
        </div>
        <UI.FieldSet>
          <UI.FieldLegend>Cache behavior</UI.FieldLegend>
          <UI.RadioGroup value={cache} onValueChange={setCache} name="gallery-cache">
            <div className="gallery-row"><UI.RadioGroupItem id={`${id}-standard`} value="standard" /><UI.Label htmlFor={`${id}-standard`}>Standard</UI.Label></div>
            <div className="gallery-row"><UI.RadioGroupItem id={`${id}-bypass`} value="bypass" /><UI.Label htmlFor={`${id}-bypass`}>Bypass</UI.Label></div>
            <div className="gallery-row"><UI.RadioGroupItem id={`${id}-enterprise`} value="enterprise" disabled /><UI.Label htmlFor={`${id}-enterprise`}>Custom rules (unavailable)</UI.Label></div>
          </UI.RadioGroup>
        </UI.FieldSet>
        <div className="gallery-row">
          <UI.Switch id={`${id}-preview`} checked={preview} onCheckedChange={setPreview} />
          <UI.Label htmlFor={`${id}-preview`}>Enable preview deployments</UI.Label>
        </div>
        <div className="gallery-row"><UI.Switch id={`${id}-disabled-switch`} checked disabled /><UI.Label htmlFor={`${id}-disabled-switch`}>Managed by policy</UI.Label></div>
      </div>
      <p className="gallery-status" role="status">Logs {logging ? "on" : "off"} · Cache {cache} · Previews {preview ? "on" : "off"}</p>
    </Example>
  );
}

function ValidatedForm() {
  const form = useForm<{ name: string }>({ defaultValues: { name: "" } });
  const [status, setStatus] = React.useState("Submit an empty name to see validation.");

  return (
    <Example title="Form validation" modules={["form"]} note="React Hook Form owns validation and submission. This example saves only local gallery state.">
      <UI.Form {...form}>
        <form className="gallery-stack" noValidate onSubmit={form.handleSubmit((values) => setStatus(`Saved application “${values.name}” in this example.`), () => setStatus("The form needs a valid application name."))}>
          <UI.FormField
            control={form.control}
            name="name"
            rules={{ required: "Enter an application name.", minLength: { value: 3, message: "Use at least 3 characters." } }}
            render={({ field }) => (
              <UI.FormItem>
                <UI.FormLabel>New application name</UI.FormLabel>
                <UI.FormControl><UI.Input placeholder="my-application" {...field} /></UI.FormControl>
                <UI.FormDescription>At least 3 characters. No cloud resource will be created.</UI.FormDescription>
                <UI.FormMessage />
              </UI.FormItem>
            )}
          />
          <div className="gallery-row">
            <UI.Button type="submit">Save application</UI.Button>
            <UI.Button type="button" variant="outline" onClick={() => { form.reset(); setStatus("Form reset."); }}>Reset</UI.Button>
          </div>
          <p className="gallery-status" role="status">{status}</p>
        </form>
      </UI.Form>
    </Example>
  );
}

function SearchExample() {
  const [query, setQuery] = React.useState("");
  const applications = ["storefront", "billing-api", "asset-worker", "documentation"];
  const results = applications.filter((application) => application.includes(query.toLowerCase()));

  return (
    <Example title="Search field" modules={["search-field"]}>
      <UI.SearchField aria-label="Search applications" placeholder="Search applications…" value={query} onChange={(event) => setQuery(event.target.value)} />
      <p className="gallery-status" role="status">{results.length ? results.join(" · ") : "No applications match this search."}</p>
    </Example>
  );
}

function OTPExample() {
  const [value, setValue] = React.useState("");
  const [complete, setComplete] = React.useState(false);

  return (
    <Example title="Verification code" modules={["input-otp"]} note="OTP is an inferred adaptation. The dashboard reference did not include this component.">
      <UI.InputOTP maxLength={6} value={value} onChange={(next) => { setValue(next); setComplete(false); }} onComplete={() => setComplete(true)} aria-label="Six-digit verification code" pattern="^[0-9]*$">
        <UI.InputOTPGroup><UI.InputOTPSlot index={0} /><UI.InputOTPSlot index={1} /><UI.InputOTPSlot index={2} /></UI.InputOTPGroup>
        <UI.InputOTPSeparator />
        <UI.InputOTPGroup><UI.InputOTPSlot index={3} /><UI.InputOTPSlot index={4} /><UI.InputOTPSlot index={5} /></UI.InputOTPGroup>
      </UI.InputOTP>
      <p className="gallery-status" role="status">{complete ? "Six digits entered. Example complete." : `${value.length} of 6 digits entered.`}</p>
    </Example>
  );
}

function NativeSelectExample() {
  const id = React.useId();
  const [region, setRegion] = React.useState("weur");

  return (
    <Example title="Native select" modules={["native-select"]}>
      <div className="gallery-field">
        <UI.Label htmlFor={id}>Storage region</UI.Label>
        <UI.NativeSelect id={id} value={region} onChange={(event) => setRegion(event.target.value)}>
          <UI.NativeSelectOption value="automatic">Automatic</UI.NativeSelectOption>
          <UI.NativeSelectOptGroup label="Location hints">
            <UI.NativeSelectOption value="weur">Western Europe</UI.NativeSelectOption>
            <UI.NativeSelectOption value="enam">Eastern North America</UI.NativeSelectOption>
            <UI.NativeSelectOption value="apac">Asia Pacific</UI.NativeSelectOption>
          </UI.NativeSelectOptGroup>
        </UI.NativeSelect>
      </div>
      <p className="gallery-status" role="status">Location hint: {region}</p>
    </Example>
  );
}

function SelectExample() {
  const id = React.useId();
  const [environment, setEnvironment] = React.useState("preview");

  return (
    <Example title="Select menu" modules={["select"]}>
      <div className="gallery-field">
        <UI.Label htmlFor={id}>Environment</UI.Label>
        <UI.Select value={environment} onValueChange={setEnvironment} name="gallery-environment">
          <UI.SelectTrigger id={id}><UI.SelectValue placeholder="Choose an environment" /></UI.SelectTrigger>
          <UI.SelectContent>
            <UI.SelectGroup>
              <UI.SelectLabel>Active environments</UI.SelectLabel>
              <UI.SelectItem value="preview">Preview</UI.SelectItem>
              <UI.SelectItem value="staging">Staging</UI.SelectItem>
              <UI.SelectItem value="production">Production</UI.SelectItem>
            </UI.SelectGroup>
            <UI.SelectSeparator />
            <UI.SelectItem value="archived" disabled>Archived (unavailable)</UI.SelectItem>
          </UI.SelectContent>
        </UI.Select>
      </div>
      <p className="gallery-status" role="status">Selected environment: {environment}</p>
    </Example>
  );
}

const frameworks = ["Astro", "Next.js", "React", "SvelteKit", "Vue"];

function ComboboxExample() {
  const [framework, setFramework] = React.useState<string | null>(null);

  return (
    <Example title="Searchable combobox" modules={["combobox"]} note="Compound combobox behavior extends the captured command and select patterns; its exact dashboard appearance is inferred.">
      <UI.Combobox items={frameworks} value={framework} onValueChange={setFramework}>
        <UI.ComboboxInput aria-label="Framework" placeholder="Choose a framework…" showClear />
        <UI.ComboboxContent>
          <UI.ComboboxEmpty>No frameworks match.</UI.ComboboxEmpty>
          <UI.ComboboxList>
            {frameworks.map((item) => <UI.ComboboxItem key={item} value={item}>{item}</UI.ComboboxItem>)}
          </UI.ComboboxList>
        </UI.ComboboxContent>
      </UI.Combobox>
      <p className="gallery-status" role="status">Framework: {framework || "not selected"}</p>
    </Example>
  );
}

function CommandExample() {
  const [action, setAction] = React.useState("No command selected.");

  return (
    <Example title="Command search" modules={["command"]}>
      <UI.Command loop aria-label="Application commands">
        <UI.CommandInput placeholder="Search commands…" />
        <UI.CommandList>
          <UI.CommandEmpty>No matching commands.</UI.CommandEmpty>
          <UI.CommandGroup heading="Applications">
            <UI.CommandItem value="Open storefront" onSelect={() => setAction("Open storefront selected.")}>Open storefront<UI.CommandShortcut>⌘1</UI.CommandShortcut></UI.CommandItem>
            <UI.CommandItem value="View deployments" onSelect={() => setAction("View deployments selected.")}>View deployments<UI.CommandShortcut>⌘2</UI.CommandShortcut></UI.CommandItem>
          </UI.CommandGroup>
          <UI.CommandSeparator />
          <UI.CommandGroup heading="Settings">
            <UI.CommandItem value="Manage environments" onSelect={() => setAction("Manage environments selected.")}>Manage environments</UI.CommandItem>
            <UI.CommandItem value="Delete application" disabled>Delete application (unavailable)</UI.CommandItem>
          </UI.CommandGroup>
        </UI.CommandList>
      </UI.Command>
      <p className="gallery-status" role="status">{action}</p>
    </Example>
  );
}

export default function FormsExamples() {
  return (
    <div className="gallery-examples">
      <BasicFields />
      <InputGroups />
      <ChoiceControls />
      <ValidatedForm />
      <SearchExample />
      <OTPExample />
      <NativeSelectExample />
      <SelectExample />
      <ComboboxExample />
      <CommandExample />
    </div>
  );
}
