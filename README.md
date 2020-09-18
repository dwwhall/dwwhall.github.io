## About  

Nextstrain recommends developing the tutorial before running your own analysis. 
Link to Zika Tutorial: https://nextstrain.org/docs/tutorials/zika


This is a [Nextstrain](https://nextstrain.org) build for SARS-CoV-2.  The data was used to compare COVID-19 positive samples from Indiana to the global dataset.  The full build can be found at https://covid19-indiana.soic.iupui.edu/.  Note: Only 1 sample from Indiana was included in this GitHub repo.

In order to run this build, Nextstrain must be installed on your device.  Instructions can be found at the link: https://nextstrain.org/docs/getting-started/local-installation


### Data

The example our data is 1 indiana Sample.  The Global data is NCBI viral sequneces provided from Nextstrain.  


The hCoV-19 / SARS-CoV-2 genomes were generously shared via GISAID. We gratefully acknowledge the Authors, Originating and Submitting laboratories of the genetic sequence and metadata made available through GISAID on which this research is based.

In order to download the GISAID data to run yourself, please see [Running a SARS-CoV-2 analysis](./docs/running.md)

> Please note that `data/metadata.tsv` is no longer included as part of this repo and should be downloaded directly from GISAID.

### Commands in Terminal
cd into folder with this build

#### Combine Fasta Files
cat *.fasta > combined.fasta

#### Combine the difference datafiles
cat data/our_sequences.fasta data/global_sequences.fasta > data/sequences.fasta

cp ./data/global_metadata.tsv ./data/metadata.tsv
tail +2 ./data/our_metadata.tsv >> ./data/metadata.tsv

#### Nextstrain Commands
augur filter \
  --sequences data/sequences.fasta \
  --metadata data/metadata.tsv \
  --exclude config/exclude.txt \
  --output results/filtered.fasta \
  --group-by division year month \
  --sequences-per-group 500 \
  --min-date 2020

augur align \
  --sequences results/filtered.fasta \
  --reference-sequence config/reference.gb \
  --output results/aligned.fasta \
  --fill-gaps
  
augur tree \
  --alignment results/aligned.fasta \
  --output results/tree_raw.nwk
  
augur refine \
  --tree results/tree_raw.nwk \
  --alignment results/aligned.fasta \
  --metadata data/metadata.tsv \
  --output-tree results/tree.nwk \
  --output-node-data results/branch_lengths.json \
  --timetree \
  --coalescent opt \
  --date-confidence \
  --date-inference marginal \
  --clock-filter-iqd 4

augur traits \
  --tree results/tree.nwk \
  --metadata data/metadata.tsv \
  --output results/traits.json \
  --columns division region country \
  --confidence
  
augur ancestral \
  --tree results/tree.nwk \
  --alignment results/aligned.fasta \
  --output-node-data results/nt_muts.json \
  --inference joint
  
augur translate \
  --tree results/tree.nwk \
  --ancestral-sequences results/nt_muts.json \
  --reference-sequence config/reference.gb \
  --output results/aa_muts.json

augur export v2 \
  --tree results/tree.nwk \
  --metadata data/metadata.tsv \
  --node-data results/branch_lengths.json \
              results/traits.json \
              results/nt_muts.json \
              results/aa_muts.json \
  --colors config/color_schemes.tsv \
  --lat-longs config/lat_longs.tsv \
  --auspice-config config/auspice_config.json \
  --output auspice/MyNewBuild.json
  
#### Run this command to view the build on your local host.
auspice view

### Bioinformatics notes

Site numbering and genome structure uses [Wuhan-Hu-1/2019](https://www.ncbi.nlm.nih.gov/nuccore/MN908947) as reference. The phylogeny is rooted relative to early samples from Wuhan. Temporal resolution assumes a nucleotide substitution rate of [8 &times; 10^-4 subs per site per year](http://virological.org/t/phylodynamic-analysis-176-genomes-6-mar-2020/356). There were SNPs present in the nCoV samples in the first and last few bases of the alignment that were masked as likely sequencing artifacts.

If you'd like to customize and run the analysis yourself, please see the [developer docs](./DEV_DOCS.md).

## How to run using your own data

  - [How to format the metadata](./docs/metadata.md)
  - [Running a SARS-CoV-2 analysis](./docs/running.md)
  - [Understanding the structure of the workflow](./docs/workflow_structure.md) including directory structure and the order in which Snakemake runs rules

## Contributing

We welcome contributions from the community! Please note that we strictly adhere to the [Contributor Covenant Code of Conduct](https://github.com/nextstrain/.github/blob/master/CODE_OF_CONDUCT.md).

### Contributing to translations of our situation reports  
Please see the [translations repo](https://github.com/nextstrain/translations) to get started!

### Contributing to software or documentation   
Please see our [Contributor Guide](https://github.com/nextstrain/.github/blob/master/CONTRIBUTING.md) to get started!

### Contributing data  
**Please note that we automatically pick up any hCoV-19 data that is submitted to GISAID.**  

If you're a lab and you'd like to get started sequencing, please see:  
* [Protocols from the ARTIC network](https://www.protocols.io/groups/artic/publications)  
* [Funding opportunities for sequencing efforts](https://twitter.com/firefoxx66/status/1242147905768751106)  
* Or, if these don't meet your needs, [get in touch](mailto:hello@nextstrain.org)  
# Indiana_ncov_Nextstrain

