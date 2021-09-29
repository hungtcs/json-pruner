
json-pruner
====

[![build workflow](https://github.com/hungtcs/json-pruner/actions/workflows/build.yml/badge.svg)](https://github.com/hungtcs/json-pruner/actions/workflows/build.yml)

json pruning tool based on json-path.

### Installation

```shell
npm install --global json-pruner
```

### Usage

#### Prune
```shell
Usage: json-pruner prune [options] <json-paths...>

pruning json through json-path

Arguments:
  json-paths                     json path expressions

Options:
  -f --file <file>               input file path
  -p --pretty [pretty]           formatted output (default: true)
  -w --write [write]             overwrite file, effective when --file provided, dangerous and
                                 irreversible (default: false)
  -o --output <output>           output path
  -i --indent-size <indentSize>  indent size of the output file, effective when pretty is true
                                 (default: 2)
  -h, --help                     display help for command
```

Examples:
```shell
$ echo "{ \"a\": 1, \"b\": 2 }" | json-pruner prune "$.b"
{
  "a": 1
}
```

#### Pick

```shell
Usage: json-pruner pick [options] <json-paths...>

pick value through json-path

Arguments:
  json-paths        json path expressions

Options:
  -f --file <file>  input file path
  -h, --help        display help for command
```

Examples:
```shell
$ echo "{ \"a\": 1, \"b\": 2 }" | json-pruner pick "$.b"
2
```
