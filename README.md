# BioCheat
Toolbox for gene analysis
http://biocheat.wisewolf.org

It uses Flask, React.js, D3.js, Require.js and some open source javascript libraries.

Some features uses database. You can download at
biocheat_backup_20161214.sql - https://drive.google.com/file/d/0B-ELLS_9v1eGSDAyNXZGNFV0NUk/view?usp=drivesdk

You can use without db but database is needed to full feature.

To use db, download database dump above and set database.
You have to create config.py at /biocheat/, same level with dao.py.
config.py sould
```
DB_USER= <user>
DB_PASS= <password>
```

After configuration, run main.py and rest_server.py both.
Then set reverse proxy /api/ to 8081 port and / to 8080 port.

**NOTICE: There's so many things to do alone. Every interests, contributes, opinions, requests and emails are welcom.**

holo@wisewolf.org

## Implemented Tools

### Random Base Sequence Generator
Random base sequence genderator can regulate sequence length and GC content.
http://biocheat.wisewolf.org/random_base_generator

### CpG Island Detector
CpG island detector from FASTA format.
http://biocheat.wisewolf.org/CpG_island

### Base Skew Plotter
Tool for calculate and plot skew between two bases.
http://biocheat.wisewolf.org/base_skew

### Origin of Replication Finder
Tool for find ori position using GC skew. Scanning window will be fixed half of length of input sequence.
http://biocheat.wisewolf.org/ori_finder

### Exon Intron Finder
Using exon's spectral property that has peak at (2/3)π when Fourier transformed. It uses DCT to spectral analysis.
http://biocheat.wisewolf.org/exon_intron

### Z Curve Plotter
Z curve plotter using Plotly.js.
http://biocheat.wisewolf.org/z_curve

### Codon Analyzer
Tool for codon analyzing. It provides translattion of codon sequence to amino acid sequence and calculattion of codon ratios and relative codon usage.
http://biocheat.wisewolf.org/codon_analyzer

### Amino Sequence to Codon Converter
Tool for convert amino acid to codon according to relative codon usage and translation table.
http://biocheat.wisewolf.org/amino_seq_to_codon

### Calculate Base Length From Electrophoresis Result 
Tool for estimate length of base from electophoresis marker.
http://biocheat.wisewolf.org/base_len

### Calculate Restrict Map From Electrophoresis Result 
Tool for calculate restrict map from electrophoresis result of double digest and partial digest.(Partial digest not implemented)
http://biocheat.wisewolf.org/restrict_map
