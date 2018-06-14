(function () {
  'use strict';

  angular.module('gbrs.services').service('sequenceUtil', sequenceUtil);

  sequenceUtil.$inject = ['$q', '$http', 'Config'];

  function sequenceUtil($q, $http, Config) {

    return {
      translate: translate,
      molWt: molWt,
      validateSequence: validateSequence,
      subStrSequence: subStrSequence,
      validateOrfStartCodonSequence: validateOrfStartCodonSequence,
      removeFormatting: removeFormatting,
      removeNonDna: removeNonDna,
      removeNonDnaStrict: removeNonDnaStrict,
      removeNonProtein: removeNonProtein,
      removeNonProteinStrict: removeNonProteinStrict,
      removeNonProteinAllowDegen: removeNonProteinAllowDegen,
      removeNonProteinAllowX: removeNonProteinAllowX,
      removeWhiteSpace: removeWhiteSpace,
      reverse: reverse

    };

    //function to translate a seqeunce
    //Assumptions :
    //   GenticCode = Standard
    //   Translate : reading frame 1
    //   strand : direct
    function translate(seq) {
      if (isEmpty(seq)) return "";
      //var geneticCode = "/gc[acgturyswkmbdhvn]/=A"; //xxx== hardoded the genetic code
      var geneticCode = getGeneticCodeString('standard');
      geneticCode = geneticCode.split(/,/);
      //console.log(geneticCode);
      var dna = this.removeNonDna(seq);
      var startPos = 0;
      var strand = 'direct';

      var geneticCodeMatchExp = getGeneticCodeMatchExp(geneticCode);
      var geneticCodeMatchResult = getGeneticCodeMatchResult(geneticCode);
      dna = dna.substring(startPos, dna.length);
      //don't translate if fewer than three bases
      if (dna.replace(/[^A-Za-z]/g, "").length < 3) {
        return "";
      }

      dna = dna.replace(/(...)/g,
        function (str, p1, offset, s) {
          return " " + p1 + " ";
        }
      );

      for (var i = 0; i < geneticCodeMatchExp.length; i++) {
        dna = dna.replace(geneticCodeMatchExp[i], geneticCodeMatchResult[i]);
      }

      dna = dna.replace(/\S{3}/g, "X");
      dna = dna.replace(/\s\S{1,2}$/, "");
      dna = dna.replace(/\s/g, "");
      return dna;
    }
    // function to calculate average molecular weight
    function molWt(seq) {
      var deferred = $q.defer();
      if (isEmpty(seq)) {
        deferred.resolve('0.0');
      }
      $http.get(Config.SeqMolWTEndpoint, {
        params: {
          sequence: seq
        }
      }).then(function (response) {
        if ($.trim(response.data).length == 0) {
          deferred.resolve('0.0');
        } else if (response.data.length == 0) {
          deferred.resolve('0.0');
        } else {
          //deferred.resolve(response.data);
          //deferred.resolve(Math.round(response.data * 100) / 100);
          deferred.resolve(Math.round(response.data));
        }
      });
      return deferred.promise;
    }
    //function that validates orf sequences ((end-start)+1%3 == 0 ) is a valid sequence
    function validateSequence(start, end) {
      if (((end - start + 1) % 3) == '0')
        return true;
      return false;
    }

    //function that takes a seq, start & end to return a substring based on start and end
    function subStrSequence(seq, start, end) {
      if (isEmpty(seq) || isEmpty(start) || isEmpty(end)) return "";
      var subStr = seq.substring(start - 1, end);
      //console.log(subStr);
      return subStr;
    }

    //function that validates orf sequence with start and stop codons via regex
    function validateOrfStartCodonSequence(type, seq) {
      //console.log(" type : " + type);
      //console.log(seq);
      if (type == 'orf seq') {
        var fStart = s.startsWith(seq.toLowerCase(), 'atg');
        var sStart = s.startsWith(seq.toLowerCase(), 'gtg');
        if (fStart == true || sStart == true)
          return true;
        return false;
      }
      if (type == 'pre amino seq') {
        var fStart = s.startsWith(seq.toUpperCase(), 'M');
        var sStart = s.startsWith(seq.toUpperCase(), 'V');
        if (fStart == true || sStart == true)
          return true;
        return false;
      }
      if (type == 'orf stop codons seq') {
        var tagEnd = s.endsWith(seq.toLowerCase(), 'tag');
        var taaEnd = s.endsWith(seq.toLowerCase(), 'taa');
        var tgaEnd = s.endsWith(seq.toLowerCase(), 'tga');
        if (tagEnd == true || taaEnd == true || tgaEnd == true)
          return true;
        return false;
      }
      if (type == 'pre amino seq stop codons') {
        var aminoEnd = s.endsWith(seq, '*');
        if (aminoEnd == true)
          return true;
        return false;
      }
    }

    //function to remove formatting
    function removeFormatting(seq) {
      if (isEmpty(seq)) return "";
      return seq.replace(/[\d\s]/g, "");
    }

    //function to remove non DNA
    function removeNonDna(sequence) {
      return sequence.replace(/[^gatucryswkmbdhvnxGATUCRYSWKMBDHVNX]/g, "");
    }

    function removeNonDnaStrict(sequence) {
      return sequence.replace(/[^gatucGATUC]/g, "");
    }

    function removeNonProtein(sequence) {
      return sequence.replace(/[^ACDEFGHIKLMNPQRSTVWYZacdefghiklmnpqrstvwyz\*]/g, "");
    }

    function removeNonProteinStrict(sequence) {
      return sequence.replace(/[^ACDEFGHIKLMNPQRSTVWYZacdefghiklmnpqrstvwyz\*]/g, "");
    }

    function removeNonProteinAllowDegen(sequence) {
      return sequence.replace(/[^ABCDEFGHIKLMNPQRSTVWYXZabcdefghiklmnpqrstvwyxz\*]/g, "");
    }

    function removeNonProteinAllowX(sequence) {
      return sequence.replace(/[^ACDEFGHIKLMNPQRSTVWYZXacdefghiklmnpqrstvwyzx\*]/g, "");
    }

    function removeWhiteSpace(text) {
      return text.replace(/\s/g, "");
    }

    function removeNonLetters(sequence) {
      return sequence.replace(/[^A-Z]/gi, "");
    }

    function reverse(dnaSequence) {
      var tempDnaArray = new Array();
      if (dnaSequence.search(/./) != -1) {
        tempDnaArray = dnaSequence.match(/./g);
        tempDnaArray = tempDnaArray.reverse();
        dnaSequence = tempDnaArray.join("");
      }
      return dnaSequence;
    };

    function getGeneticCodeMatchExp(arrayOfPatterns) {
      var geneticCodeMatchExp = new Array(arrayOfPatterns.length);
      for (var j = 0; j < arrayOfPatterns.length; j++) {
        geneticCodeMatchExp[j] = eval(arrayOfPatterns[j].match(/\/.+\//) + "gi");
      }
      return geneticCodeMatchExp;
    }

    function getGeneticCodeMatchResult(arrayOfPatterns) {
      var geneticCodeMatchResult = new Array(arrayOfPatterns.length);
      for (var j = 0; j < arrayOfPatterns.length; j++) {
        geneticCodeMatchResult[j] = (arrayOfPatterns[j].match(/=[a-zA-Z\*]/)).toString();
        geneticCodeMatchResult[j] = geneticCodeMatchResult[j].replace(/=/g, "");
      }
      return geneticCodeMatchResult;
    }

    //Genetic Codes
    //Written by Paul Stothard, University of Alberta, Canada

    function getGeneticCodeString(type) {

      //  The Standard Code (transl_table=1)
      //    AAs  = FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //  Starts = ---M---------------M---------------M----------------------------
      //  Base1  = TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG
      //  Base2  = TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG
      //  Base3  = TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG

      if ((type.toLowerCase() == "standard") || (type.toLowerCase() == "transl_table=1")) {
        return "/gc[acgturyswkmbdhvn]/=A," +
          "/[tu]g[ctuy]/=C," +
          "/ga[tcuy]/=D," +
          "/ga[agr]/=E," +
          "/[tu][tu][tcuy]/=F," +
          "/gg[acgturyswkmbdhvn]/=G," +
          "/ca[tcuy]/=H," +
          "/a[tu][atcuwmhy]/=I," +
          "/aa[agr]/=K," +
          "/c[tu][acgturyswkmbdhvn]|[tu][tu][agr]|[ctuy][tu][agr]/=L," +
          "/a[tu]g/=M," +
          "/aa[tucy]/=N," +
          "/cc[acgturyswkmbdhvn]/=P," +
          "/ca[agr]/=Q," +
          "/cg[acgturyswkmbdhvn]|ag[agr]|[cam]g[agr]/=R," +
          "/[tu]c[acgturyswkmbdhvn]|ag[ct]/=S," +
          "/ac[acgturyswkmbdhvn]/=T," +
          "/g[tu][acgturyswkmbdhvn]/=V," +
          "/[tu]gg/=W," +
          "/[tu]a[ctuy]/=Y," +
          "/[tu]a[agr]|[tu]ga|[tu][agr]a/=*";
      }

      //  The Vertebrate Mitochondrial Code (transl_table=2)
      //Standard = FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //    AAs  = FFLLSSSSYY**CCWWLLLLPPPPHHQQRRRRIIMMTTTTNNKKSS**VVVVAAAADDEEGGGG
      //  Starts = --------------------------------MMMM---------------M------------
      //  Base1  = TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG
      //  Base2  = TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG
      //  Base3  = TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG


      if (type.toLowerCase() == "transl_table=2") {
        return "/gc[acgturyswkmbdhvn]/=A," +
          "/[tu]g[ctuy]/=C," +
          "/ga[tcuy]/=D," +
          "/ga[agr]/=E," +
          "/[tu][tu][tcuy]/=F," +
          "/gg[acgturyswkmbdhvn]/=G," +
          "/ca[tcuy]/=H," +
          "/a[tu][tcuy]/=I," +
          "/aa[agr]/=K," +
          "/c[tu][acgturyswkmbdhvn]|[tu][tu][agr]|[ctuy][tu][agr]/=L," +
          "/a[tu][agr]/=M," +
          "/aa[tucy]/=N," +
          "/cc[acgturyswkmbdhvn]/=P," +
          "/ca[agr]/=Q," +
          "/cg[acgturyswkmbdhvn]/=R," +
          "/[tu]c[acgturyswkmbdhvn]|ag[ct]/=S," +
          "/ac[acgturyswkmbdhvn]/=T," +
          "/g[tu][acgturyswkmbdhvn]/=V," +
          "/[tu]g[agr]/=W," +
          "/[tu]a[ctuy]/=Y," +
          "/[tu]a[agr]|ag[agr]/=*";
      }


      //  The Yeast Mitochondrial Code (transl_table=3)
      //Standard = FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //    AAs  = FFLLSSSSYY**CCWWTTTTPPPPHHQQRRRRIIMMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //  Starts = ----------------------------------MM----------------------------
      //  Base1  = TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG
      //  Base2  = TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG
      //  Base3  = TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG


      if (type.toLowerCase() == "transl_table=3") {
        return "/gc[acgturyswkmbdhvn]/=A," +
          "/[tu]g[ctuy]/=C," +
          "/ga[tcuy]/=D," +
          "/ga[agr]/=E," +
          "/[tu][tu][tcuy]/=F," +
          "/gg[acgturyswkmbdhvn]/=G," +
          "/ca[tcuy]/=H," +
          "/a[tu][tcuy]/=I," +
          "/aa[agr]/=K," +
          "/[tu][tu][agr]/=L," +
          "/a[tu][agr]/=M," +
          "/aa[tucy]/=N," +
          "/cc[acgturyswkmbdhvn]/=P," +
          "/ca[agr]/=Q," +
          "/cg[acgturyswkmbdhvn]|ag[agr]|[cam]g[agr]/=R," +
          "/[tu]c[acgturyswkmbdhvn]|ag[ct]/=S," +
          "/ac[acgturyswkmbdhvn]|c[tu][acgturyswkmbdhvn]/=T," +
          "/g[tu][acgturyswkmbdhvn]/=V," +
          "/[tu]g[agr]/=W," +
          "/[tu]a[ctuy]/=Y," +
          "/[tu]a[agr]/=*";
      }

      //  The Mold, Protozoan, and Coelenterate Mitochondrial Code and the Mycoplasma/Spiroplasma Code (transl_table=4)
      //Standard = FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //    AAs  = FFLLSSSSYY**CCWWLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //  Starts = --MM---------------M------------MMMM---------------M------------
      //  Base1  = TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG
      //  Base2  = TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG
      //  Base3  = TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG

      if (type.toLowerCase() == "transl_table=4") {
        return "/gc[acgturyswkmbdhvn]/=A," +
          "/[tu]g[ctuy]/=C," +
          "/ga[tcuy]/=D," +
          "/ga[agr]/=E," +
          "/[tu][tu][tcuy]/=F," +
          "/gg[acgturyswkmbdhvn]/=G," +
          "/ca[tcuy]/=H," +
          "/a[tu][atcuwmhy]/=I," +
          "/aa[agr]/=K," +
          "/c[tu][acgturyswkmbdhvn]|[tu][tu][agr]|[ctuy][tu][agr]/=L," +
          "/a[tu]g/=M," +
          "/aa[tucy]/=N," +
          "/cc[acgturyswkmbdhvn]/=P," +
          "/ca[agr]/=Q," +
          "/cg[acgturyswkmbdhvn]|ag[agr]|[cam]g[agr]/=R," +
          "/[tu]c[acgturyswkmbdhvn]|ag[ct]/=S," +
          "/ac[acgturyswkmbdhvn]/=T," +
          "/g[tu][acgturyswkmbdhvn]/=V," +
          "/[tu]g[agr]/=W," +
          "/[tu]a[ctuy]/=Y," +
          "/[tu]a[agr]/=*";
      }

      //  The Invertebrate Mitochondrial Code (transl_table=5)
      //Standard = FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //    AAs  = FFLLSSSSYY**CCWWLLLLPPPPHHQQRRRRIIMMTTTTNNKKSSSSVVVVAAAADDEEGGGG
      //  Starts = ---M----------------------------MMMM---------------M------------
      //  Base1  = TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG
      //  Base2  = TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG
      //  Base3  = TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG

      if (type.toLowerCase() == "transl_table=5") {
        return "/gc[acgturyswkmbdhvn]/=A," +
          "/[tu]g[ctuy]/=C," +
          "/ga[tcuy]/=D," +
          "/ga[agr]/=E," +
          "/[tu][tu][tcuy]/=F," +
          "/gg[acgturyswkmbdhvn]/=G," +
          "/ca[tcuy]/=H," +
          "/a[tu][tcuy]/=I," +
          "/aa[agr]/=K," +
          "/c[tu][acgturyswkmbdhvn]|[tu][tu][agr]|[ctuy][tu][agr]/=L," +
          "/a[tu][agr]/=M," +
          "/aa[tucy]/=N," +
          "/cc[acgturyswkmbdhvn]/=P," +
          "/ca[agr]/=Q," +
          "/cg[acgturyswkmbdhvn]/=R," +
          "/[tu]c[acgturyswkmbdhvn]|ag[acgturyswkmbdhvn]/=S," +
          "/ac[acgturyswkmbdhvn]/=T," +
          "/g[tu][acgturyswkmbdhvn]/=V," +
          "/[tu]g[agr]/=W," +
          "/[tu]a[ctuy]/=Y," +
          "/[tu]a[agr]/=*";
      }

      //  The Ciliate, Dasycladacean and Hexamita Nuclear Code (transl_table=6)
      //Standard = FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //    AAs  = FFLLSSSSYYQQCC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //  Starts = -----------------------------------M----------------------------
      //  Base1  = TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG
      //  Base2  = TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG
      //  Base3  = TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG

      if (type.toLowerCase() == "transl_table=6") {
        return "/gc[acgturyswkmbdhvn]/=A," +
          "/[tu]g[ctuy]/=C," +
          "/ga[tcuy]/=D," +
          "/ga[agr]/=E," +
          "/[tu][tu][tcuy]/=F," +
          "/gg[acgturyswkmbdhvn]/=G," +
          "/ca[tcuy]/=H," +
          "/a[tu][atcuwmhy]/=I," +
          "/aa[agr]/=K," +
          "/c[tu][acgturyswkmbdhvn]|[tu][tu][agr]|[ctuy][tu][agr]/=L," +
          "/a[tu]g/=M," +
          "/aa[tucy]/=N," +
          "/cc[acgturyswkmbdhvn]/=P," +
          "/ca[agr]|[tu]a[agr]|[tcuy]a[agr]/=Q," +
          "/cg[acgturyswkmbdhvn]|ag[agr]|[cam]g[agr]/=R," +
          "/[tu]c[acgturyswkmbdhvn]|ag[ct]/=S," +
          "/ac[acgturyswkmbdhvn]/=T," +
          "/g[tu][acgturyswkmbdhvn]/=V," +
          "/[tu]gg/=W," +
          "/[tu]a[ctuy]/=Y," +
          "/[tu]ga/=*";
      }


      //  The Echinoderm and Flatworm Mitochondrial Code (transl_table=9)
      //Standard = FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //    AAs  = FFLLSSSSYY**CCWWLLLLPPPPHHQQRRRRIIIMTTTTNNNKSSSSVVVVAAAADDEEGGGG
      //  Starts = -----------------------------------M---------------M------------
      //  Base1  = TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG
      //  Base2  = TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG
      //  Base3  = TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG

      if (type.toLowerCase() == "transl_table=9") {
        return "/gc[acgturyswkmbdhvn]/=A," +
          "/[tu]g[ctuy]/=C," +
          "/ga[tcuy]/=D," +
          "/ga[agr]/=E," +
          "/[tu][tu][tcuy]/=F," +
          "/gg[acgturyswkmbdhvn]/=G," +
          "/ca[tcuy]/=H," +
          "/a[tu][atcuwmhy]/=I," +
          "/aag/=K," +
          "/c[tu][acgturyswkmbdhvn]|[tu][tu][agr]|[ctuy][tu][agr]/=L," +
          "/a[tu]g/=M," +
          "/aa[atcuwmhy]/=N," +
          "/cc[acgturyswkmbdhvn]/=P," +
          "/ca[agr]/=Q," +
          "/cg[acgturyswkmbdhvn]/=R," +
          "/[tu]c[acgturyswkmbdhvn]|ag[acgturyswkmbdhvn]/=S," +
          "/ac[acgturyswkmbdhvn]/=T," +
          "/g[tu][acgturyswkmbdhvn]/=V," +
          "/[tu]g[agr]/=W," +
          "/[tu]a[ctuy]/=Y," +
          "/[tu]a[agr]/=*";
      }


      //  The Euplotid Nuclear Code (transl_table=10)
      //Standard = FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //    AAs  = FFLLSSSSYY**CCCWLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //  Starts = -----------------------------------M----------------------------
      //  Base1  = TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG
      //  Base2  = TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG
      //  Base3  = TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG

      if (type.toLowerCase() == "transl_table=10") {
        return "/gc[acgturyswkmbdhvn]/=A," +
          "/[tu]g[atcuwmhy]/=C," +
          "/ga[tcuy]/=D," +
          "/ga[agr]/=E," +
          "/[tu][tu][tcuy]/=F," +
          "/gg[acgturyswkmbdhvn]/=G," +
          "/ca[tcuy]/=H," +
          "/a[tu][atcuwmhy]/=I," +
          "/aa[agr]/=K," +
          "/c[tu][acgturyswkmbdhvn]|[tu][tu][agr]|[ctuy][tu][agr]/=L," +
          "/a[tu]g/=M," +
          "/aa[tucy]/=N," +
          "/cc[acgturyswkmbdhvn]/=P," +
          "/ca[agr]/=Q," +
          "/cg[acgturyswkmbdhvn]|ag[agr]|[cam]g[agr]/=R," +
          "/[tu]c[acgturyswkmbdhvn]|ag[ct]/=S," +
          "/ac[acgturyswkmbdhvn]/=T," +
          "/g[tu][acgturyswkmbdhvn]/=V," +
          "/[tu]gg/=W," +
          "/[tu]a[ctuy]/=Y," +
          "/[tu]a[agr]/=*";
      }

      //  The Bacterial and Plant Plastid Code (transl_table=11)
      //Standard = FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //    AAs  = FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //  Starts = ---M---------------M------------MMMM---------------M------------
      //  Base1  = TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG
      //  Base2  = TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG
      //  Base3  = TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG

      if (type.toLowerCase() == "transl_table=11") {
        return "/gc[acgturyswkmbdhvn]/=A," +
          "/[tu]g[ctuy]/=C," +
          "/ga[tcuy]/=D," +
          "/ga[agr]/=E," +
          "/[tu][tu][tcuy]/=F," +
          "/gg[acgturyswkmbdhvn]/=G," +
          "/ca[tcuy]/=H," +
          "/a[tu][atcuwmhy]/=I," +
          "/aa[agr]/=K," +
          "/c[tu][acgturyswkmbdhvn]|[tu][tu][agr]|[ctuy][tu][agr]/=L," +
          "/a[tu]g/=M," +
          "/aa[tucy]/=N," +
          "/cc[acgturyswkmbdhvn]/=P," +
          "/ca[agr]/=Q," +
          "/cg[acgturyswkmbdhvn]|ag[agr]|[cam]g[agr]/=R," +
          "/[tu]c[acgturyswkmbdhvn]|ag[ct]/=S," +
          "/ac[acgturyswkmbdhvn]/=T," +
          "/g[tu][acgturyswkmbdhvn]/=V," +
          "/[tu]gg/=W," +
          "/[tu]a[ctuy]/=Y," +
          "/[tu]a[agr]|[tu]ga|[tu][agr]a/=*";
      }


      //  The Alternative Yeast Nuclear Code (transl_table=12)
      //Standard = FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //    AAs  = FFLLSSSSYY**CC*WLLLSPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //  Starts = -------------------M---------------M----------------------------
      //  Base1  = TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG
      //  Base2  = TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG
      //  Base3  = TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG

      if (type.toLowerCase() == "transl_table=12") {
        return "/gc[acgturyswkmbdhvn]/=A," +
          "/[tu]g[ctuy]/=C," +
          "/ga[tcuy]/=D," +
          "/ga[agr]/=E," +
          "/[tu][tu][tcuy]/=F," +
          "/gg[acgturyswkmbdhvn]/=G," +
          "/ca[tcuy]/=H," +
          "/a[tu][atcuwmhy]/=I," +
          "/aa[agr]/=K," +
          "/c[tu][atcuwmhy]|[tu][tu][agr]|[ctuy][tu]a/=L," +
          "/a[tu]g/=M," +
          "/aa[tucy]/=N," +
          "/cc[acgturyswkmbdhvn]/=P," +
          "/ca[agr]/=Q," +
          "/cg[acgturyswkmbdhvn]|ag[agr]|[cam]g[agr]/=R," +
          "/[tu]c[acgturyswkmbdhvn]|ag[ct]|c[tu]g/=S," +
          "/ac[acgturyswkmbdhvn]/=T," +
          "/g[tu][acgturyswkmbdhvn]/=V," +
          "/[tu]gg/=W," +
          "/[tu]a[ctuy]/=Y," +
          "/[tu]a[agr]|[tu]ga|[tu][agr]a/=*";
      }


      //  The Ascidian Mitochondrial Code (transl_table=13)
      //Standard = FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //    AAs  = FFLLSSSSYY**CCWWLLLLPPPPHHQQRRRRIIMMTTTTNNKKSSGGVVVVAAAADDEEGGGG
      //  Starts = ---M------------------------------MM---------------M------------
      //  Base1  = TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG
      //  Base2  = TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG
      //  Base3  = TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG

      if (type.toLowerCase() == "transl_table=13") {
        return "/gc[acgturyswkmbdhvn]/=A," +
          "/[tu]g[ctuy]/=C," +
          "/ga[tcuy]/=D," +
          "/ga[agr]/=E," +
          "/[tu][tu][tcuy]/=F," +
          "/gg[acgturyswkmbdhvn]|ag[agr]|[agr]g[agr]/=G," +
          "/ca[tcuy]/=H," +
          "/a[tu][tcuy]/=I," +
          "/aa[agr]/=K," +
          "/c[tu][acgturyswkmbdhvn]|[tu][tu][agr]|[ctuy][tu][agr]/=L," +
          "/a[tu][agr]/=M," +
          "/aa[tucy]/=N," +
          "/cc[acgturyswkmbdhvn]/=P," +
          "/ca[agr]/=Q," +
          "/cg[acgturyswkmbdhvn]/=R," +
          "/[tu]c[acgturyswkmbdhvn]|ag[ct]/=S," +
          "/ac[acgturyswkmbdhvn]/=T," +
          "/g[tu][acgturyswkmbdhvn]/=V," +
          "/[tu]g[agr]/=W," +
          "/[tu]a[ctuy]/=Y," +
          "/[tu]a[agr]/=*";
      }

      //  The Alternative Flatworm Mitochondrial Code (transl_table=14)
      //Standard = FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //    AAs  = FFLLSSSSYYY*CCWWLLLLPPPPHHQQRRRRIIIMTTTTNNNKSSSSVVVVAAAADDEEGGGG
      //  Starts = -----------------------------------M----------------------------
      //  Base1  = TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG
      //  Base2  = TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG
      //  Base3  = TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG

      if (type.toLowerCase() == "transl_table=14") {
        return "/gc[acgturyswkmbdhvn]/=A," +
          "/[tu]g[ctuy]/=C," +
          "/ga[tcuy]/=D," +
          "/ga[agr]/=E," +
          "/[tu][tu][tcuy]/=F," +
          "/gg[acgturyswkmbdhvn]/=G," +
          "/ca[tcuy]/=H," +
          "/a[tu][atcuwmhy]/=I," +
          "/aag/=K," +
          "/c[tu][acgturyswkmbdhvn]|[tu][tu][agr]|[ctuy][tu][agr]/=L," +
          "/a[tu]g/=M," +
          "/aa[atcuwmhy]/=N," +
          "/cc[acgturyswkmbdhvn]/=P," +
          "/ca[agr]/=Q," +
          "/cg[acgturyswkmbdhvn]/=R," +
          "/[tu]c[acgturyswkmbdhvn]|ag[acgturyswkmbdhvn]/=S," +
          "/ac[acgturyswkmbdhvn]/=T," +
          "/g[tu][acgturyswkmbdhvn]/=V," +
          "/[tu]g[agr]/=W," +
          "/[tu]a[atcuwmhy]/=Y," +
          "/[tu]ag/=*";
      }

      //  Blepharisma Nuclear Code (transl_table=15)
      //Standard = FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //    AAs  = FFLLSSSSYY*QCC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //  Starts = -----------------------------------M----------------------------
      //  Base1  = TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG
      //  Base2  = TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG
      //  Base3  = TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG

      if (type.toLowerCase() == "transl_table=15") {
        return "/gc[acgturyswkmbdhvn]/=A," +
          "/[tu]g[ctuy]/=C," +
          "/ga[tcuy]/=D," +
          "/ga[agr]/=E," +
          "/[tu][tu][tcuy]/=F," +
          "/gg[acgturyswkmbdhvn]/=G," +
          "/ca[tcuy]/=H," +
          "/a[tu][atcuwmhy]/=I," +
          "/aa[agr]/=K," +
          "/c[tu][acgturyswkmbdhvn]|[tu][tu][agr]|[ctuy][tu][agr]/=L," +
          "/a[tu]g/=M," +
          "/aa[tucy]/=N," +
          "/cc[acgturyswkmbdhvn]/=P," +
          "/ca[agr]|[tu]ag|[tcuy]ag/=Q," +
          "/cg[acgturyswkmbdhvn]|ag[agr]|[cam]g[agr]/=R," +
          "/[tu]c[acgturyswkmbdhvn]|ag[ct]/=S," +
          "/ac[acgturyswkmbdhvn]/=T," +
          "/g[tu][acgturyswkmbdhvn]/=V," +
          "/[tu]gg/=W," +
          "/[tu]a[ctuy]/=Y," +
          "/[tu][agr]a/=*";
      }

      //  Chlorophycean Mitochondrial Code (transl_table=16)
      //Standard = FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //    AAs  = FFLLSSSSYY*LCC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //  Starts = -----------------------------------M----------------------------
      //  Base1  = TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG
      //  Base2  = TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG
      //  Base3  = TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG

      if (type.toLowerCase() == "transl_table=16") {
        return "/gc[acgturyswkmbdhvn]/=A," +
          "/[tu]g[ctuy]/=C," +
          "/ga[tcuy]/=D," +
          "/ga[agr]/=E," +
          "/[tu][tu][tcuy]/=F," +
          "/gg[acgturyswkmbdhvn]/=G," +
          "/ca[tcuy]/=H," +
          "/a[tu][atcuwmhy]/=I," +
          "/aa[agr]/=K," +
          "/c[tu][acgturyswkmbdhvn]|[tu][tu][agr]|[ctuy][tu][agr]|[tu]ag|[tu][atuw]g/=L," +
          "/a[tu]g/=M," +
          "/aa[tucy]/=N," +
          "/cc[acgturyswkmbdhvn]/=P," +
          "/ca[agr]/=Q," +
          "/cg[acgturyswkmbdhvn]|ag[agr]|[cam]g[agr]/=R," +
          "/[tu]c[acgturyswkmbdhvn]|ag[ct]/=S," +
          "/ac[acgturyswkmbdhvn]/=T," +
          "/g[tu][acgturyswkmbdhvn]/=V," +
          "/[tu]gg/=W," +
          "/[tu]a[ctuy]/=Y," +
          "/[tu][agr]a/=*";
      }

      //  Trematode Mitochondrial Code (transl_table=21)
      //Standard = FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //    AAs  = FFLLSSSSYY**CCWWLLLLPPPPHHQQRRRRIIMMTTTTNNNKSSSSVVVVAAAADDEEGGGG
      //  Starts = -----------------------------------M---------------M------------
      //  Base1  = TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG
      //  Base2  = TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG
      //  Base3  = TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG

      if (type.toLowerCase() == "transl_table=21") {
        return "/gc[acgturyswkmbdhvn]/=A," +
          "/[tu]g[ctuy]/=C," +
          "/ga[tcuy]/=D," +
          "/ga[agr]/=E," +
          "/[tu][tu][tcuy]/=F," +
          "/gg[acgturyswkmbdhvn]/=G," +
          "/ca[tcuy]/=H," +
          "/a[tu][tcuy]/=I," +
          "/aag/=K," +
          "/c[tu][acgturyswkmbdhvn]|[tu][tu][agr]|[ctuy][tu][agr]/=L," +
          "/a[tu][agr]/=M," +
          "/aa[atcuwmhy]/=N," +
          "/cc[acgturyswkmbdhvn]/=P," +
          "/ca[agr]/=Q," +
          "/cg[acgturyswkmbdhvn]/=R," +
          "/[tu]c[acgturyswkmbdhvn]|ag[acgturyswkmbdhvn]/=S," +
          "/ac[acgturyswkmbdhvn]/=T," +
          "/g[tu][acgturyswkmbdhvn]/=V," +
          "/[tu]g[agr]/=W," +
          "/[tu]a[ctuy]/=Y," +
          "/[tu]a[agr]/=*";
      }


      //  Scenedesmus obliquus mitochondrial Code (transl_table=22)
      //Standard = FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //    AAs  = FFLLSS*SYY*LCC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //  Starts = -----------------------------------M----------------------------
      //  Base1  = TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG
      //  Base2  = TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG
      //  Base3  = TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG

      if (type.toLowerCase() == "transl_table=22") {
        return "/gc[acgturyswkmbdhvn]/=A," +
          "/[tu]g[ctuy]/=C," +
          "/ga[tcuy]/=D," +
          "/ga[agr]/=E," +
          "/[tu][tu][tcuy]/=F," +
          "/gg[acgturyswkmbdhvn]/=G," +
          "/ca[tcuy]/=H," +
          "/a[tu][atcuwmhy]/=I," +
          "/aa[agr]/=K," +
          "/c[tu][acgturyswkmbdhvn]|[tu][tu][agr]|[ctuy][tu][agr]|[tu]ag|[tu][atuw]g/=L," +
          "/a[tu]g/=M," +
          "/aa[tucy]/=N," +
          "/cc[acgturyswkmbdhvn]/=P," +
          "/ca[agr]/=Q," +
          "/cg[acgturyswkmbdhvn]|ag[agr]|[cam]g[agr]/=R," +
          "/[tu]c[cgtyskb]|ag[ct]/=S," +
          "/ac[acgturyswkmbdhvn]/=T," +
          "/g[tu][acgturyswkmbdhvn]/=V," +
          "/[tu]gg/=W," +
          "/[tu]a[ctuy]/=Y," +
          "/[tu][agcrsmv]a/=*";
      }


      //  Thraustochytrium Mitochondrial Code (transl_table=23)
      //Standard = FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //    AAs  = FF*LSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG
      //  Starts = --------------------------------M--M---------------M------------
      //  Base1  = TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG
      //  Base2  = TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG
      //  Base3  = TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG

      if (type.toLowerCase() == "transl_table=23") {
        return "/gc[acgturyswkmbdhvn]/=A," +
          "/[tu]g[ctuy]/=C," +
          "/ga[tcuy]/=D," +
          "/ga[agr]/=E," +
          "/[tu][tu][tcuy]/=F," +
          "/gg[acgturyswkmbdhvn]/=G," +
          "/ca[tcuy]/=H," +
          "/a[tu][atcuwmhy]/=I," +
          "/aa[agr]/=K," +
          "/c[tu][acgturyswkmbdhvn]|[ctuy][tu]g/=L," +
          "/a[tu]g/=M," +
          "/aa[tucy]/=N," +
          "/cc[acgturyswkmbdhvn]/=P," +
          "/ca[agr]/=Q," +
          "/cg[acgturyswkmbdhvn]|ag[agr]|[cam]g[agr]/=R," +
          "/[tu]c[acgturyswkmbdhvn]|ag[ct]/=S," +
          "/ac[acgturyswkmbdhvn]/=T," +
          "/g[tu][acgturyswkmbdhvn]/=V," +
          "/[tu]gg/=W," +
          "/[tu]a[ctuy]/=Y," +
          "/[tu]a[agr]|[tu]ga|[tu][agtrwkd]a/=*";
      }

      return true;
    }

    //End of Gentic Codes


    //check if the give string is empty
    function isEmpty(str) {
      if ((typeof (str) == 'undefined') || ($.trim(str).length == 0))
        return true;
      return false;
    }
  };
})();